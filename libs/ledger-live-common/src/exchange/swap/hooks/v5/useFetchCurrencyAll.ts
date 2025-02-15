import { getAvailableProviders } from "../..";
import { useFeature } from "../../../../featureFlags";
import { useAPI } from "../../../../hooks/useAPI";
import { fetchCurrencyAll } from "../../api/v5";

export function useFetchCurrencyAll() {
  const fetchAdditionalCoins = useFeature("fetchAdditionalCoins");
  const { data, ...rest } = useAPI({
    queryFn: fetchCurrencyAll,
    queryProps: {
      providers: getAvailableProviders(),
      additionalCoinsFlag: fetchAdditionalCoins.enabled,
    },
    // assume the all currency list for the given props won't change during a users session.
    staleTimeout: Infinity,
  });
  return {
    ...rest,
    data: data ?? [],
  };
}
