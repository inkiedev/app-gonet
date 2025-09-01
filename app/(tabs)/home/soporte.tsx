import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/custom-input";
import { supportService } from "@/services/support";
import { theme } from "@/styles/theme";
import { BaseComponentProps } from "@/types/common";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Back from '@/assets/images/iconos gonet back.svg';
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface SoporteProps extends BaseComponentProps {
  onSendMessage?: (message: string) => Promise<string>;
  userContext?: {
    phone?: string;
    cedula?: string;
    sessionId?: string;
    userId?: string;
  };
}

export default function Soporte({ onSendMessage, userContext, style, testID }: SoporteProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleGoBack = () => {
    router.back();
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      let responseText: string;

      if (onSendMessage) {
        responseText = await onSendMessage(userMessage.text);
      } else {
        responseText = await supportService.sendMessage(userMessage.text, userContext);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, ocurrió un error. Por favor intenta nuevamente.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageBubble,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.isUser ? styles.userMessageText : styles.botMessageText
      ]}>
        {item.text}
      </Text>
      <Text style={[
        styles.messageTime,
        item.isUser ? styles.userMessageTime : styles.botMessageTime
      ]}>
        {item.timestamp.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>
    </View>
  );

  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome-' + Date.now(),
      text: '¡Hola! Bienvenido al soporte de GoNet. Estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?',
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <SafeAreaView style={[styles.container, style]} edges={['top']} testID={testID}>
      <Header
        title="Soporte"
        leftAction={{
          icon: <Back width={24} height={24} color={theme.colors.text.primary} />,
          onPress: handleGoBack,
        }}
        variant="default"
      />
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesList}
            ListEmptyComponent={
              <View style={styles.loadingMessage}>
                <Ionicons
                  name="chatbubble-ellipses"
                  size={32}
                  color={theme.colors.primary}
                />
                <Text style={styles.loadingMessageText}>Iniciando chat...</Text>
              </View>
            }
          />
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Escribiendo...</Text>
            </View>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <Input
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor={theme.colors.text.secondary}
            multiline
            maxLength={500}
            editable={!isLoading}
            testID="support-message-input"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            activeOpacity={0.7}
            testID="support-send-button"
            accessibilityLabel="Enviar mensaje"
            accessibilityHint="Envía tu mensaje al soporte"
          >
            <Ionicons
              name="send"
              size={20}
              color={(!inputText.trim() || isLoading) ? theme.colors.text.secondary : theme.colors.surface}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  loadingMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    minHeight: 200,
  },
  loadingMessageText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  messagesList: {
    paddingVertical: theme.spacing.md,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    marginVertical: theme.spacing.xs,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
    marginLeft: '20%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    marginRight: '20%',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  messageText: {
    fontSize: theme.fontSize.md,
    lineHeight: 20,
  },
  userMessageText: {
    color: theme.colors.surface,
  },
  botMessageText: {
    color: theme.colors.text.primary,
  },
  messageTime: {
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
    opacity: 0.7,
  },
  userMessageTime: {
    color: theme.colors.surface,
    textAlign: 'right',
  },
  botMessageTime: {
    color: theme.colors.text.secondary,
    textAlign: 'left',
  },
  loadingContainer: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  loadingText: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.sm,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  textInput: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border.light,
  },
});