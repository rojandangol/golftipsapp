import { Stack } from 'expo-router';
import { UserProvider } from '@/context/useridcontext'; 

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="signup"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgotpassword"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}