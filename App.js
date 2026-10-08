import AppNavigator from './src/navigation/AppNavigator';
import AppProviders from './src/hooks/AppProviders';

export default function App() {
  return (
    <AppProviders>
      <AppNavigator />
    </AppProviders>
  );
}
