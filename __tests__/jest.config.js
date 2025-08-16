module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node', 
  testMatch: ['**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/scripts/**',
    '!src/assets/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../src/$1', 
    '^@expo/vector-icons$': '@expo/vector-icons'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@expo|expo|@react-navigation|react-redux|@reduxjs/toolkit)'
  ],
  clearMocks: false,      // evita limpiar los mocks automáticamente
  resetMocks: false,      // evita resetear los mocks entre tests
  restoreMocks: false,  
};
