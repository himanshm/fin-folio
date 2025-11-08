// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch, useSelector, useStore } from "react-redux";
import { type AppDispatch, type AppStore, type RootState } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
