import React from "react";
import {
  Box,
  ScrollView,
  VStack,
  HStack,
  Text,
  Button,
  Pressable,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  FormControl,
  FormControlError,
  FormControlErrorText,
  Spinner,
  useToast,
  ToastDescription,
  Toast,
  ToastTitle,
} from "@gluestack-ui/themed";
import { MapPin, Package, ArrowLeft } from "lucide-react";
import { useApi } from "@/src/hooks/useApi";
import { createOrder } from "@/src/services/order.service";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import { DatePickerInput } from "react-native-paper-dates";
import * as Yup from "yup";

const CreateOrderSchema = Yup.object().shape({
  pickup_location: Yup.string()
    .required("Pickup location is required")
    .min(3, "Location must be at least 3 characters"),
  delivery_location: Yup.string()
    .required("Delivery location is required")
    .min(3, "Location must be at least 3 characters"),
  pickup_time: Yup.date()
    .required("Pickup time is required")
    .min(new Date(), "Pickup time must be in the future"),
  delivery_time: Yup.date()
    .required("Delivery time is required")
    .min(Yup.ref("pickup_time"), "Delivery time must be after pickup time"),
  cargo_details: Yup.object().shape({
    weight: Yup.number()
      .required("Weight is required")
      .positive("Weight must be positive")
      .typeError("Weight must be a number"),
    dimensions: Yup.object().shape({
      length: Yup.number()
        .min(1, "Length must be at least 1")
        .typeError("Length must be a number"),
      width: Yup.number()
        .min(1, "Width must be at least 1")
        .typeError("Width must be a number"),
      height: Yup.number()
        .min(1, "Height must be at least 1")
        .typeError("Height must be a number"),
    }),
  }),
  notes: Yup.string(),
});

const CreateOrderScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const createOrderApi = useApi(createOrder);
  const [apiError, setApiError] = React.useState(null);

  const initialValues = {
    pickup_location: "",
    delivery_location: "",
    pickup_time: new Date(),
    delivery_time: new Date(),
    cargo_details: {
      weight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
    },
    notes: "",
  };

  const handleSubmit = async (values, { setErrors, setSubmitting, resetForm }) => {
    try {
      if (values.cargo_details.dimensions.length == "")
        delete values.cargo_details.dimensions.length;
      if (values.cargo_details.dimensions.width == "")
        delete values.cargo_details.dimensions.width;
      if (values.cargo_details.dimensions.height == "")
        delete values.cargo_details.dimensions.height;
      await createOrderApi.request(values);
      resetForm();
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="success" variant="solid">
            <ToastTitle>Success</ToastTitle>
            <ToastDescription> Order created successfully</ToastDescription>
          </Toast>
        ),
      });
      navigation.navigate("Home", { shouldRefresh: true });
    } catch (error) {
      setSubmitting(false);

      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 422:
            // Validation errors from API
            if (data.errors) {
              const formErrors = {};
              Object.keys(data.errors).forEach((key) => {
                const keys = key.split("."); // Split the key into parts for nesting
                let current = formErrors;

                // Traverse or create the nested structure
                keys.forEach((k, index) => {
                  if (index === keys.length - 1) {
                    // Last key in the chain, assign the error message
                    current[k] = data.errors[key].join(", "); // Combine all messages into a single string
                  } else {
                    // Ensure the intermediate key exists as an object
                    current[k] = current[k] || {};
                    current = current[k];
                  }
                });
              });
              setErrors(formErrors);
            }
            setApiError(data.message || "Failed to create order");
            break;

          default:
            setApiError("An error occurred while creating the order");
        }
      } else if (error.request) {
        setApiError("Network error. Please check your connection");
      } else {
        setApiError("An unexpected error occurred");
      }

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="solid">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>{apiError}</ToastDescription>
          </Toast>
        ),
      });
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <Box
        px="$4"
        py="$3"
        bg="white"
        borderBottomWidth={1}
        borderBottomColor="$borderLight100"
      >
        <HStack justifyContent="space-between" alignItems="center" gap="md">
          <Pressable
            onPress={() => navigation.goBack()}
            p="$2"
            bg="$primary50"
            rounded="$lg"
          >
            <ArrowLeft size={20} color="#666" />
          </Pressable>
          {/* Changes start here */}
          <HStack justifyContent="center" flex={1}>
            {" "}
            {/* Added flex: 1 and justifyContent: 'center' */}
            <Text fontSize="$lg" fontWeight="$bold">
              Create New Order
            </Text>
          </HStack>{" "}
        </HStack>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={CreateOrderSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => (
          <ScrollView flex={1}>
            <Box p="$4">
              <VStack gap="$4">
                {/* Main Card */}
                <Box
                  borderWidth={1}
                  borderColor="$borderLight100"
                  borderRadius="$xl"
                  bg="$white"
                  p="$4"
                  shadowColor="$gray300"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.25}
                  shadowRadius={3.84}
                  elevation={5}
                >
                  {/* Location Section */}
                  <HStack flexWrap="wrap" mx="-$2" mb="$4">
                    <Box width="100%" p="$2">
                      <FormControl
                        isRequired
                        isInvalid={
                          touched.pickup_location && errors.pickup_location
                        }
                      >
                        <Box bg="$gray50" p="$3" borderRadius="$lg">
                          <HStack gap="$2" alignItems="center" mb="$1">
                            <MapPin size={18} color="#666" />
                            <Text size="xs" color="$gray500">
                              Pickup Location
                            </Text>
                          </HStack>
                          <Input size="md" bg="transparent" p={0}>
                            <InputField
                              placeholder="Enter pickup location"
                              value={values.pickup_location}
                              onChangeText={handleChange("pickup_location")}
                              onBlur={handleBlur("pickup_location")}
                            />
                          </Input>
                        </Box>
                        <FormControlError>
                          <FormControlErrorText fontSize="$xs">
                            {errors.pickup_location}
                          </FormControlErrorText>
                        </FormControlError>
                      </FormControl>
                    </Box>

                    <Box width="100%" px="$2" pb="$2">
                      <FormControl
                        isRequired
                        isInvalid={
                          touched.delivery_location && errors.delivery_location
                        }
                      >
                        <Box bg="$gray50" p="$3" borderRadius="$lg">
                          <HStack gap="$2" alignItems="center" mb="$1">
                            <MapPin size={18} color="#666" />
                            <Text size="xs" color="$gray500">
                              Delivery Location
                            </Text>
                          </HStack>
                          <Input size="md" bg="transparent" p={0}>
                            <InputField
                              placeholder="Enter delivery location"
                              value={values.delivery_location}
                              onChangeText={handleChange("delivery_location")}
                              onBlur={handleBlur("delivery_location")}
                            />
                          </Input>
                        </Box>
                        <FormControlError>
                          <FormControlErrorText fontSize="$xs">
                            {errors.delivery_location}
                          </FormControlErrorText>
                        </FormControlError>
                      </FormControl>
                    </Box>

                    <Box width="100%" px="$2" pb="$2">
                      <FormControl
                        isRequired
                        isInvalid={touched.pickup_time && errors.pickup_time}
                      >
                        <DatePickerInput
                          style={{ backgroundColor: "white", color: "black" }}
                          locale="en"
                          label="Pickup Date"
                          value={values.pickup_time}
                          onChange={(d) => setFieldValue("pickup_time", d)}
                          inputMode="end"
                          validRange={{ startDate: new Date() }}
                          mode="flat"
                        />
                        <FormControlError>
                          <FormControlErrorText fontSize="$xs">
                            {errors.pickup_time}
                          </FormControlErrorText>
                        </FormControlError>
                      </FormControl>
                    </Box>

                    <Box width="100%" px="$2" pb="$2">
                      <FormControl
                        isRequired
                        isInvalid={
                          touched.delivery_time && errors.delivery_time
                        }
                      >
                        <DatePickerInput
                          style={{ backgroundColor: "white", color: "black" }}
                          locale="en"
                          label="Delivery Date"
                          validRange={{ startDate: values.pickup_time }}
                          value={values.delivery_time}
                          onChange={(d) => setFieldValue("delivery_time", d)}
                          inputMode="end"
                          mode="flat"
                        />
                        <FormControlError>
                          <FormControlErrorText fontSize="$xs">
                            {errors.delivery_time}
                          </FormControlErrorText>
                        </FormControlError>
                      </FormControl>
                    </Box>

                    {/* Cargo Details */}
                    <Box width="100%" px="$2" pb="$2">
                      <Box bg="$gray50" p="$3" borderRadius="$lg">
                        <HStack gap="$2" alignItems="center" mb="$2">
                          <Package size={18} color="#666" />
                          <Text size="xs" color="$gray500">
                            Cargo Details
                          </Text>
                        </HStack>

                        <VStack gap="$3">
                          <FormControl
                            isRequired
                            isInvalid={
                              touched.cargo_details?.weight &&
                              errors.cargo_details?.weight
                            }
                          >
                            <Input
                              size="md"
                              bg="white"
                              borderWidth={1}
                              borderColor="$gray200"
                            >
                              <InputField
                                placeholder="Weight (kg)"
                                value={values.cargo_details.weight}
                                onChangeText={handleChange(
                                  "cargo_details.weight"
                                )}
                                onBlur={handleBlur("cargo_details.weight")}
                                keyboardType="numeric"
                              />
                            </Input>
                            <FormControlError>
                              <FormControlErrorText fontSize="$xs">
                                {errors.cargo_details?.weight}
                              </FormControlErrorText>
                            </FormControlError>
                          </FormControl>

                          <HStack gap="$6">
                            <FormControl
                              flex={1}
                              isInvalid={
                                touched.cargo_details?.dimensions?.length &&
                                errors.cargo_details?.dimensions?.length
                              }
                            >
                              <Input
                                size="md"
                                bg="white"
                                borderWidth={1}
                                borderColor="$gray200"
                              >
                                <InputField
                                  placeholder="Length (m)"
                                  value={values.cargo_details.dimensions.length}
                                  onChangeText={handleChange(
                                    "cargo_details.dimensions.length"
                                  )}
                                  onBlur={handleBlur(
                                    "cargo_details.dimensions.length"
                                  )}
                                  keyboardType="numeric"
                                />
                              </Input>
                              <FormControlError>
                                <FormControlErrorText fontSize="$xs">
                                  {errors.cargo_details?.dimensions?.length}
                                </FormControlErrorText>
                              </FormControlError>
                            </FormControl>

                            <FormControl
                              flex={1}
                              isInvalid={
                                touched.cargo_details?.dimensions?.width &&
                                errors.cargo_details?.dimensions?.width
                              }
                            >
                              <Input
                                size="md"
                                bg="white"
                                borderWidth={1}
                                borderColor="$gray200"
                              >
                                <InputField
                                  placeholder="Width (m)"
                                  value={values.cargo_details.dimensions.width}
                                  onChangeText={handleChange(
                                    "cargo_details.dimensions.width"
                                  )}
                                  onBlur={handleBlur(
                                    "cargo_details.dimensions.width"
                                  )}
                                  keyboardType="numeric"
                                />
                              </Input>
                              <FormControlError>
                                <FormControlErrorText fontSize="$xs">
                                  {errors.cargo_details?.dimensions?.width}
                                </FormControlErrorText>
                              </FormControlError>
                            </FormControl>

                            <FormControl
                              // isRequired
                              flex={1}
                              isInvalid={
                                touched.cargo_details?.dimensions?.height &&
                                errors.cargo_details?.dimensions?.height
                              }
                            >
                              <Input
                                size="md"
                                bg="white"
                                borderWidth={1}
                                borderColor="$gray200"
                              >
                                <InputField
                                  placeholder="Height (m)"
                                  value={values.cargo_details.dimensions.height}
                                  onChangeText={handleChange(
                                    "cargo_details.dimensions.height"
                                  )}
                                  onBlur={handleBlur(
                                    "cargo_details.dimensions.height"
                                  )}
                                  keyboardType="numeric"
                                />
                              </Input>
                              <FormControlError>
                                <FormControlErrorText fontSize="$xs">
                                  {errors.cargo_details?.dimensions?.height}
                                </FormControlErrorText>
                              </FormControlError>
                            </FormControl>
                          </HStack>
                        </VStack>
                      </Box>
                    </Box>

                    {/* Notes */}
                    <Box width="100%" px="$2" pb="$2">
                      <Box bg="$gray50" p="$3" borderRadius="$lg">
                        <Text size="xs" color="$gray500" mb="$2">
                          Notes
                        </Text>
                        <Textarea
                          size="md"
                          h={100}
                          bg="white"
                          borderWidth={1}
                          borderColor="$gray200"
                        >
                          <TextareaInput
                            placeholder="Add any additional notes..."
                            value={values.notes}
                            onChangeText={handleChange("notes")}
                            onBlur={handleBlur("notes")}
                          />
                        </Textarea>
                      </Box>
                    </Box>
                  </HStack>
                </Box>

                {/* Submit Button */}
                <Button
                  size="lg"
                  onPress={handleSubmit}
                  isDisabled={isSubmitting || Object.keys(errors).length > 0}
                  bg="$primary500"
                  rounded="$lg"
                >
                  {isSubmitting ? (
                    <Spinner color="white" />
                  ) : (
                    <Text color="white" fontWeight="$medium">
                      Create Order
                    </Text>
                  )}
                </Button>
              </VStack>
            </Box>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default CreateOrderScreen;
