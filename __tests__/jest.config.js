module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node', // puedes cambiar a 'jsdom' si tus tests usan DOM
  testMatch: ['**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/scripts/**',
    '!src/assets/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/setup.js'], // <-- apunta a __tests__/setup.js
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../src/$1', // <-- correcto, apunta a src/
    '^@expo/vector-icons$': '@expo/vector-icons'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@expo|expo|@react-navigation|react-redux|@reduxjs/toolkit)'
  ]
};
