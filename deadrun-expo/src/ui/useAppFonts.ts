import {
  useFonts,
  Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold,
  Outfit_700Bold, Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';

/**
 * Outfit 서체 로드.
 *
 *  로드 전에는 theme.ts 의 fontFamily 가 없는 이름이라 시스템 폰트로 보인다.
 *  화면이 한 번 바뀌는 것처럼 보이므로, 앱 최상단에서 로드가 끝날 때까지 기다린다.
 *  실패해도 앱은 떠야 하므로 error 를 던지지 않고 ready 로 취급한다.
 */
export function useAppFonts(): boolean {
  const [loaded, error] = useFonts({
    Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold,
    Outfit_700Bold, Outfit_800ExtraBold,
  });
  return loaded || !!error;
}
