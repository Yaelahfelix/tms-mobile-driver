import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { TouchableOpacity } from "react-native";
import { primaryColor } from "@/constants/Colors";
import { router } from "expo-router";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={18} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.

        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="star-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="star-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              onPress={() => router.push("/tabs/map")}
              style={{
                top: -20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: primaryColor,
                width: 60,
                height: 60,
                borderRadius: 30,
                elevation: 5,
              }}
            >
              <TabBarIcon name="map" color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="document"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="star-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="star-o" color={color} />,
        }}
      />
    </Tabs>
  );
}
