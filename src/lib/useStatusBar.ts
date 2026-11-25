import { useFocusEffect } from "expo-router";
import { setStatusBarStyle, type StatusBarStyle } from "expo-status-bar";
import { useCallback } from "react";

// Sets the status bar style while a screen is focused, then restores dark
export function useStatusBar(style: StatusBarStyle) {
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle(style);
      return () => setStatusBarStyle("dark");
    }, [style]),
  );
}
