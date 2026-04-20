import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import axios from "axios";
import { useUser } from "@/context/useridcontext";
import { deleteUserAccount } from '@/API/deleteAccount';
import axiosInstance from '@/utils/axiosInstance';

// Define the shape of user data
interface UserData {
  username: string;
  email: string;
  phone_number: string;
}

const User = () => {
  const [editButton, setEditButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setName] = useState("");
  const [userPassword, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [gmail, setGmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const { user_id, setUserId } = useUser();
  const router = useRouter();


  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user_id) {
        console.error("No user ID found in context");
        setError("Please log in to view profile");
        router.push("/");
        return;
      }
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/users/${user_id}`);
        const userData: UserData = response.data; // Single object, not array
        if (userData && userData.username) {
          setName(userData.username || "");
          setGmail(userData.email || "");
          setPhoneNumber(userData.phone_number || "");
          setPassword("");
          setError(null);
        } else {
          setError("User data not found");
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error);

        // Only redirect if authentication failed
        if (error.response?.status === 401 || error.response?.status === 403) {
          setError("Session expired. Please log in again.");
          router.push("/");
        } else {
          // For other errors, show message but stay on page
          setError("Failed to load user data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user_id]);

  // Check lockout timer
  useEffect(() => {
    if (lockoutUntil) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (now >= lockoutUntil) {
          setLockoutUntil(null);
          setPasswordAttempts(0);
          setRemainingAttempts(5);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lockoutUntil]);

  // Verify current password before enabling edit mode
  // Replace verifyPassword function (lines 97-166)
  const verifyPassword = async () => {
    // Check if user is locked out
    if (lockoutUntil) {
      const now = Date.now();
      if (now < lockoutUntil) {
        const minutesLeft = Math.ceil((lockoutUntil - now) / 60000);
        Alert.alert(
          "Account Locked",
          `Too many failed attempts. Please try again in ${minutesLeft} minute(s).`
        );
        return;
      } else {
        setLockoutUntil(null);
        setPasswordAttempts(0);
        setRemainingAttempts(5);
      }
    }

    if (!user_id || !currentPassword) {
      Alert.alert("Error", "Please enter your current password");
      return;
    }

    try {
      const response = await axiosInstance.post(`/verifyPassword`, {
        user_id,
        password: currentPassword,
      });


      // ✅ Check response properly
      if (response.status === 200 && response.data.verified === true) {
        setIsPasswordVerified(true);
        setEditButton(true);
        setCurrentPassword("");
        setPasswordAttempts(0);
        setRemainingAttempts(5);
        setLockoutUntil(null);
        Alert.alert("Success", "Password verified. You can now edit your profile.");
      } else {
        // This shouldn't happen with 200 status
        handleIncorrectPassword();
      }
    } catch (error: any) {

      // ✅ Handle 401 (wrong password)
      if (error.response?.status === 401) {
        handleIncorrectPassword();
      }
      // ✅ Handle network errors
      else if (error.message === 'Network Error') {
        Alert.alert(
          "Connection Error",
          "Cannot reach server. Please check:\n\n1. Server is running (node server.js)\n2. You're on the same WiFi\n3. API_URL is correct"
        );
      }
      // ✅ Handle other errors
      else {
        Alert.alert("Error", error.response?.data?.message || "Failed to verify password. Please try again.");
      }
    }
  };
  // ✅ Add this helper function after verifyPassword
  const handleIncorrectPassword = () => {
    // Increment failed attempts
    const newAttempts = passwordAttempts + 1;
    setPasswordAttempts(newAttempts);
    const remaining = 5 - newAttempts;
    setRemainingAttempts(remaining);

    if (newAttempts >= 5) {
      // Lock out for 30 minutes
      const lockoutTime = Date.now() + (30 * 60 * 1000);
      setLockoutUntil(lockoutTime);
      setCurrentPassword("");
      Alert.alert(
        "Account Locked",
        "Too many failed password attempts. Please try again in 30 minutes.",
        [{ text: "OK", onPress: () => setEditButton(false) }]
      );
    } else {
      // Show remaining attempts
      setCurrentPassword("");
      Alert.alert(
        "Incorrect Password",
        `Wrong password. You have ${remaining} attempt(s) remaining.`
      );
    }
  };

  // Update user data when saving
  // Update user data when saving
  const saveUserData = async () => {
    if (!user_id) {
      console.error("No user ID available for saving");
      Alert.alert("Error", "Cannot save: No user ID");
      return;
    }

    try {
      // ✅ Only include password if user actually entered a new one
      const updateData: any = {
        user_id,
        username: userName,
        email: gmail,
        phone_number: phoneNumber,
      };

      // Only send password if user typed something
      if (userPassword && userPassword.trim() !== '') {
        updateData.password = userPassword;
        ('🔐 Updating password');
      } else {
        ('📝 Not updating password');
      }

      (console.log('📤 Sending update data:', {
        ...updateData,
        password: updateData.password ? '***' : 'NOT_INCLUDED'
      }));

      const response = await axiosInstance.post(`/putuserinfo`, updateData);

      if (response.status === 200) {
        setEditButton(false);
        setIsPasswordVerified(false);
        setPassword(""); // Clear the password field
        Alert.alert("Success", "Profile updated successfully");
      } else {
        throw new Error(response.data.message || "Failed to save user data");
      }
    } catch (error: any) {
      console.error("❌ Error saving user data:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to save user data");
    }
  };


  // Verify password specifically for account deletion
  const verifyPasswordForDeletion = async (password: string): Promise<boolean> => {
    if (!user_id || !password) {
      Alert.alert("Error", "Please enter your password");
      return false;
    }

    try {
      const response = await axiosInstance.post(`/verifyPassword`, {
        user_id,
        password: password,
      });

      if (response.status === 200 && response.data.verified === true) {
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert("Incorrect Password", "The password you entered is incorrect.");
      } else {
        Alert.alert("Error", "Failed to verify password. Please try again.");
      }
      return false;
    }
  };

  // Delete user account
  // Delete user account with password verification
  const handleDeleteAccount = () => {
    // First, prompt for password
    Alert.prompt(
      'Verify Your Identity',
      'Please enter your password to continue with account deletion:',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Verify',
          onPress: async (password?: string) => {
            if (!password || password.trim() === '') {
              Alert.alert('Error', 'Password is required');
              return;
            }

            // Verify the password
            const isVerified = await verifyPasswordForDeletion(password);

            if (!isVerified) {
              return; // Stop if password is wrong
            }

            // Password verified, show first confirmation
            Alert.alert(
              'Delete Account',
              'Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    // Final confirmation
                    Alert.alert(
                      'Final Confirmation',
                      'This is your last chance. Delete your account permanently?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel'
                        },
                        {
                          text: 'Yes, Delete Forever',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await deleteUserAccount(user_id);

                              Alert.alert('Account Deleted', 'Your account has been permanently deleted.', [
                                {
                                  text: 'OK',
                                  onPress: async () => {
                                    // Clear stored credentials like logout does
                                    await AsyncStorage.multiRemove([
                                      'user_id',
                                      'authToken',
                                      'tokenExpiry',
                                    ]);

                                    ('✅ AsyncStorage cleared');

                                    setUserId(null);
                                    ('✅ UserId set to null');

                                    router.replace("/");
                                    ('✅ Redirecting to /');
                                  }
                                }
                              ]);
                            } catch (error: any) {
                              console.error('Delete account error:', error);
                              Alert.alert('Error', error.response?.data?.message || 'Failed to delete account. Please try again.');
                            }
                          }
                        }
                      ]
                    );
                  }
                }
              ]
            );
          }
        }
      ],
      'secure-text'
    );
  };
  // Show loading spinner
  if (loading) {
    return (
      <View className="bg-zinc-950 h-full flex-1 justify-center items-center">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  // Only show full-screen error if initial load failed
  if (error && !userName) {
    return (
      <View className="bg-zinc-950 h-full flex-1 justify-center items-center">
        <Text className="text-red-400 text-lg mb-4">{error}</Text>
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="bg-blue-400 px-4 py-2 rounded-md"
        >
          <Text className="text-black font-semibold">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="bg-zinc-950 h-full">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="bg-zinc-900 rounded-2xl p-4 mb-6 border border-white/10 h-full">

          <View className="flex-row items-center mb-4">
            <Image
              source={require("@/assets/icons/user.png")}
              className="w-10 h-10 mr-3"
            />
            <Text className="text-white text-xl font-semibold">User Profile</Text>
          </View>

          {!isPasswordVerified && editButton ? (
            <View className="py-3 border-t border-white/20">
              <Text className="text-white/70 text-sm mb-1">Current Password</Text>

              {passwordAttempts > 0 && !lockoutUntil && (
                <Text className="text-orange-400 text-xs mb-2">
                  ⚠️ {remainingAttempts} attempt(s) remaining
                </Text>
              )}

              {lockoutUntil && (
                <Text className="text-red-400 text-xs mb-2">
                  🔒 Account locked. Try again in {Math.ceil((lockoutUntil - Date.now()) / 60000)} minute(s)
                </Text>
              )}

              <View className="flex-row items-center justify-between">
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#a1a1aa"
                  className="text-white text-base bg-white/5 px-3 py-1 rounded-md flex-1"
                  editable={!lockoutUntil}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-3"
                >
                  <Text className="text-blue-400 text-base">
                    {showPassword ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={verifyPassword}
                className={`px-4 py-2 rounded-md mt-4 ${lockoutUntil ? 'bg-gray-600' : 'bg-blue-400'}`}
                disabled={!!lockoutUntil}
              >
                <Text className="text-black font-semibold text-center">
                  {lockoutUntil ? "Locked" : "Verify Password"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View className="flex-row justify-start space-x-16 mb-4 p-1">
                <View className="flex-row justify-start mb-4 px-4">
                  <TouchableOpacity
                    onPress={() => setEditButton(true)}
                    className="bg-green-400 px-4 py-2 rounded-md mr-6"
                    disabled={isPasswordVerified}
                  >
                    <Text className="text-black font-semibold">Edit Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={saveUserData}
                    className="bg-blue-400 px-4 py-2 rounded-md"
                    disabled={!isPasswordVerified}
                  >
                    <Text className="text-black font-semibold">Save</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text className="text-white text-base font-semibold mb-2">
                Login Credentials
              </Text>

              <View className="py-3 border-t border-white/20">
                <Text className="text-white/70 text-sm mb-1">Username</Text>
                {isPasswordVerified && editButton ? (
                  <TextInput
                    value={userName}
                    onChangeText={setName}
                    className="text-white text-base bg-white/5 px-3 py-1 rounded-md"
                  />
                ) : (
                  <Text className="text-white text-base">{userName}</Text>
                )}
              </View>

              <View className="py-3 border-t border-white/20">
                <Text className="text-white/70 text-sm mb-1">Password</Text>
                {isPasswordVerified && editButton ? (
                  <View className="flex-row items-center justify-between">
                    <TextInput
                      value={userPassword}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      placeholder="Enter new password"
                      placeholderTextColor="#a1a1aa"
                      className="text-white text-base bg-white/5 px-3 py-1 rounded-md flex-1"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="ml-3"
                    >
                      <Text className="text-blue-400 text-base">
                        {showPassword ? "🙈" : "👁️"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text className="text-white text-base">********</Text>
                )}
              </View>

              <View className="py-3 border-t border-white/20">
                <Text className="text-white/70 text-sm mb-1">Email</Text>
                {isPasswordVerified && editButton ? (
                  <TextInput
                    value={gmail}
                    onChangeText={setGmail}
                    className="text-white text-base bg-white/5 px-3 py-1 rounded-md"
                  />
                ) : (
                  <Text className="text-white text-base">{gmail}</Text>
                )}
              </View>

              <View className="py-3 border-t border-white/20 border-b">
                <Text className="text-white/70 text-sm mb-1">Phone Number</Text>
                {isPasswordVerified && editButton ? (
                  <TextInput
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    className="text-white text-base bg-white/5 px-3 py-1 rounded-md"
                  />
                ) : (
                  <Text className="text-white text-base">{phoneNumber}</Text>
                )}
              </View>
              {/* Delete Account Section */}
              <View className="mt-8">
                <Text className="text-white text-sm mb-3 font-bold">Delete Account</Text>
                <TouchableOpacity
                  onPress={handleDeleteAccount}
                  className="bg-red-600 px-4 py-3 rounded-md"
                >
                  <Text className="text-white font-semibold text-center">
                    Delete Account Permanently
                  </Text>
                </TouchableOpacity>
                <Text className="text-white/50 text-xs mt-2 text-center">
                  This action cannot be undone
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default User; ``