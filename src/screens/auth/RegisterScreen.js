// src/screens/auth/RegisterScreen.js
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
import { Mail, Lock, Eye, EyeOff, AlertTriangle, User, Phone } from "lucide-react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/src/context/AuthContext";

const RegisterScreen = ({ navigation }) => {
  const { register, loading } = useAuth();
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .max(255, "Name can't exceed 255 characters"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required")
      .max(255, "Email can't exceed 255 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      ),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .max(20, "Phone number can't exceed 20 characters"),
  });
  const handleRegister = async (values, { setErrors, setSubmitting }) => {
    try {

      await register(values);
      navigation.navigate("Home");
    } catch (error) {
      console.log("ASDAD",error)

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
              Welcome to Rodud
            </Heading>
            <Text size="sm" color="$textLight500">
              Sign up for a free account
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
            validationSchema={validationSchema}
            onSubmit={handleRegister}
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
                <FormControl isInvalid={touched.name && errors.name}>
                  <Input size="xl" borderRadius="$lg" borderWidth={1}>
                    <InputSlot pl="$4">
                      <InputIcon>
                        <Icon as={User} color="$textLight400" size={20} />
                      </InputIcon>
                    </InputSlot>
                    <InputField
                      placeholder="Name"
                      value={values.name}
                      onChangeText={(text) => {
                        handleChange("name")(text);
                        setApiError(null); // Clear API error when user types
                      }}
                      onBlur={handleBlur("name")}
                    />
                  </Input>
                  {touched.name && errors.name && (
                    <FormControlError>
                      <FormControlErrorText>{errors.name}</FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

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


                <FormControl
                  isInvalid={
                    touched.password_confirmation && errors.password_confirmation
                  }
                >
                  <Input size="xl" borderRadius="$lg" borderWidth={1}>
                    <InputSlot pl="$4">
                      <InputIcon>
                        <Icon as={Lock} color="$textLight400" size={20} />
                      </InputIcon>
                    </InputSlot>
                    <InputField
                      placeholder="Confirm Password"
                      value={values.password_confirmation}
                      onChangeText={(text) => {
                        handleChange("password_confirmation")(text);
                        setApiError(null); // Clear API error when user types
                      }}
                      onBlur={handleBlur("password_confirmation")}
                      type={showConfirmPassword ? "text" : "password"}
                    />
                    <InputSlot pr="$4">
                      <Pressable
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <InputIcon>
                          <Icon
                            as={showConfirmPassword ? EyeOff : Eye}
                            color="$textLight400"
                            size={20}
                          />
                        </InputIcon>
                      </Pressable>
                    </InputSlot>
                  </Input>
                  {touched.password_confirmation && errors.password_confirmation && (
                    <FormControlError>
                      <FormControlErrorText>
                        {errors.password_confirmation}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                <FormControl isInvalid={touched.phonephone && errors.phone}>
                  <Input size="xl" borderRadius="$lg" borderWidth={1}>
                    <InputSlot pl="$4">
                      <InputIcon>
                        <Icon as={Phone} color="$textLight400" size={20} />
                      </InputIcon>
                    </InputSlot>
                    <InputField
                      placeholder="0000000"
                      value={values.phone}
                      onChangeText={(text) => {
                        handleChange("phone")(text);
                        setApiError(null); // Clear API error when user types
                      }}
                      onBlur={handleBlur("phone")}
                    />
                  </Input>
                  {touched.phone && errors.phone && (
                    <FormControlError>
                      <FormControlErrorText>
                        {errors.phone}
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
                  <ButtonText>Sign Up</ButtonText>
                </Button>

                <Pressable onPress={() => navigation.navigate("Login")}>
                  <Center>
                    <Text size="sm" color="$textLight500">
                      Already have an account?{" "}
                      <Text color="$primary500" fontWeight="$bold">
                        Login
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

export default RegisterScreen;
