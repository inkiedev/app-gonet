import { Dimensions, StyleSheet } from 'react-native'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  namesContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    paddingLeft: 30,
    paddingRight: 30,
  },
  planContainer: {
    width: 275,
  },
  iconLegend: {
    color: '#009a94',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  optionsButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 70,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 998,
  },
  safeMenuWrapper: {
    flex: 1,
  },
  menuContainer: {
    width: screenWidth * 0.6,
    height: screenHeight * 0.6,
    backgroundColor: '#009a94',
    padding: 20,
    paddingTop: 60,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
  menuItemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10,
    height: 40,
    gap: 20,
  },
  menuItem: {
    fontSize: 16,
    textAlign: 'left',
    color: '#ffffff',
  }
});