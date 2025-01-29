import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React from 'react';
import {
  Button,
  FlatList,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import {
  ReanimatedScreenProvider,
  useReanimatedTransitionProgress,
} from 'react-native-screens/reanimated';

const Stack = createNativeStackNavigator();

export default function NativeNavigation() {
  return (
    <ReanimatedScreenProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="ModalList"
            component={ModalList}
            options={{
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ReanimatedScreenProvider>
  );
}

const ModalList = () => {
  const data = Array.from({ length: 100 }).map((_, i) => ({
    key: String(i),
    title: `Item ${i}`,
  }));

  const renderItem = React.useCallback<ListRenderItem<(typeof data)[number]>>(
    ({ item }) => {
      return (
        <View
          style={{
            height: 50,
            borderBottomWidth: StyleSheet.hairlineWidth,
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}>
          <Text>{item.title}</Text>
        </View>
      );
    },
    [],
  );

  return (
    <>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={data}
        renderItem={renderItem}
      />
      <BottomTab />
    </>
  );
};

function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button title="Show Modal" onPress={() => navigation.push('ModalList')} />
    </ScrollView>
  );
}

function BottomTab() {
  const { progress, closing } = useReanimatedTransitionProgress();

  const rootStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            progress.value,
            closing.value === 0 ? [1, 0] : [0, 1],
            [0, 100],
          ),
        },
      ],
    };
  }, []);

  const insets = useSafeAreaInsets();

  return (
    <FullWindowOverlay>
      <Animated.View style={[styles.root, rootStyle]}>
        <View style={[styles.container, { paddingBottom: insets.bottom }]} />
      </Animated.View>
    </FullWindowOverlay>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    height: 100,
    left: 0,
    bottom: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  container: {
    backgroundColor: 'gray',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
