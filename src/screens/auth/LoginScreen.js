// src/screens/auth/LoginScreen.js
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  Button,
  ButtonText,
  Center,
  FormControl,
  FormControlError,
  FormControlErrorText,
  Heading,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Text,
  VStack,
  Icon,
  ButtonSpinner,
  Pressable,
  Alert,
  AlertIcon,
  AlertText,
} from "@gluestack-ui/themed";
import { Mail, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/src/context/AuthContext";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required"),
});

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleLogin = async (values, { setErrors, setSubmitting }) => {
    try {
      await login(values.email, values.password);
      navigation.navigate("Home");
    } catch (error) {
      setSubmitting(false);

      // Handle different types of API errors
      if (error.response) {
        const { status, data } = error.response;
        console.log(status, data);
        switch (status) {
          case 401:
            // Invalid credentials
            setApiError("Invalid email or password");
            break;

          case 422:
            // Validation errors from the API
            if (data.errors) {
              // Map API validation errors to form fields
              const formErrors = {};
              Object.keys(data.errors).forEach((key) => {
                formErrors[key] = data.errors[key][0]; // Take first error message for each field
              });
              setErrors(formErrors);
            }

            setApiError(data.message || "Login failed.");

            break;

          default:
            setApiError(
              "An error occurred while logging in. Please try again."
            );
        }
      } else if (error.request) {
        // Network error
        setApiError(
          "Unable to connect to the server. Please check your internet connection."
        );
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Center flex={1} bg="$white" px="$4">
        <VStack space="md" w="$full" maxW="$96">
          <VStack space="xs" mb="$8">
            <Heading size="2xl" textAlign="left">
              Welcome Back to Rodud
            </Heading>
            <Text size="sm" color="$textLight500">
              Sign in to your account
            </Text>
          </VStack>

          {apiError && (
            <Alert status="error" mb="$4">
              <AlertIcon as={AlertTriangle} mr="$2" color="$error700" />
              <AlertText color="$error700">{apiError}</AlertText>
            </Alert>
          )}

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <VStack space="xl">
                <FormControl isInvalid={touched.email && errors.email}>
                  <Input size="xl" borderRadius="$lg" borderWidth={1}>
                    <InputSlot pl="$4">
                      <InputIcon>
                        <Icon as={Mail} color="$textLight400" size={20} />
                      </InputIcon>
                    </InputSlot>
                    <InputField
                      placeholder="Email"
                      value={values.email}
                      onChangeText={(text) => {
                        handleChange("email")(text);
                        setApiError(null); // Clear API error when user types
                      }}
                      onBlur={handleBlur("email")}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </Input>
                  {touched.email && errors.email && (
                    <FormControlError>
                      <FormControlErrorText>
                        {errors.email}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                <FormControl isInvalid={touched.password && errors.password}>
                  <Input size="xl" borderRadius="$lg" borderWidth={1}>
                    <InputSlot pl="$4">
                      <InputIcon>
                        <Icon as={Lock} color="$textLight400" size={20} />
                      </InputIcon>
                    </InputSlot>
                    <InputField
                      placeholder="Password"
                      value={values.password}
                      onChangeText={(text) => {
                        handleChange("password")(text);
                        setApiError(null); // Clear API error when user types
                      }}
                      onBlur={handleBlur("password")}
                      type={showPassword ? "text" : "password"}
                    />
                    <InputSlot pr="$4">
                      <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <InputIcon>
                          <Icon
                            as={showPassword ? EyeOff : Eye}
                            color="$textLight400"
                            size={20}
                          />
                        </InputIcon>
                      </Pressable>
                    </InputSlot>
                  </Input>
                  {touched.password && errors.password && (
                    <FormControlError>
                      <FormControlErrorText>
                        {errors.password}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                <Button
                  size="xl"
                  borderRadius="$lg"
                  bg="$primary500"
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <ButtonSpinner mr="$2" /> : null}
                  <ButtonText>Sign In</ButtonText>
                </Button>

                <Pressable onPress={() => navigation.navigate("Register")}>
                  <Center>
                    <Text size="sm" color="$textLight500">
                      Don't have an account?{" "}
                      <Text color="$primary500" fontWeight="$bold">
                        Sign Up
                      </Text>
                    </Text>
                  </Center>
                </Pressable>
              </VStack>
            )}
          </Formik>
        </VStack>
      </Center>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
