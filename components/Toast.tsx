import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  useWindowDimensions,
  View,
} from "react-native";

type Props = object; // ✔ prevents empty-interface lint error

export const DURATION = {
  LENGTH_SHORT: 2000,
  FOREVER: 0,
};

const Toast = forwardRef<any, Props>((_props, ref) => {
  const { height } = useWindowDimensions();

  const [isShow, setShow] = useState(false);
  const [toastText, setToastText] = useState("");
  const opacityValue = useRef(new Animated.Value(1)).current;

  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const isShowing = useRef(false);

  useEffect(() => {
    return () => {
      animation.current?.stop();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    show: (text: string) => {
      if (Platform.OS === "android") {
        ToastAndroid.show(text, ToastAndroid.SHORT);
      } else {
        show(text);
      }
    },
  }));

  const show = (text: string) => {
    setShow(true);
    setToastText(text);

    animation.current = Animated.timing(opacityValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    });

    animation.current.start(() => {
      isShowing.current = true;
      close();
    });
  };

  const close = () => {
    const delay = DURATION.LENGTH_SHORT;

    if (!isShowing.current && !isShow) {
      return;
    }

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      animation.current = Animated.timing(opacityValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      });

      animation.current.start(() => {
        setShow(false);
        isShowing.current = false;
      });
    }, delay);
  };

  return (
    <>
      {isShow && Platform.OS !== "android" && (
        <View
          style={[styles.container, { top: height - 120 }]}
          pointerEvents="none"
        >
          <Animated.View style={[styles.content, { opacity: opacityValue }]}>
            <Text style={styles.text}>{toastText}</Text>
          </Animated.View>
        </View>
      )}
    </>
  );
});

// ✔ Fix ESLint display-name error
Toast.displayName = "Toast";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    elevation: 999,
    alignItems: "center",
    zIndex: 10000,
  },
  content: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 10,
    bottom: 64,
    maxWidth: "80%",
  },
  text: {
    fontSize: 14,
    color: "#f8f8f8",
    textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default Toast;
