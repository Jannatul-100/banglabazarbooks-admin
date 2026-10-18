export interface Setting {
  _id?: string;
  analytics?: {
    tagManagerId?: string;
    facebookPixelId?: string;
    facebookPixelAccessToken?: string;
    IsManageFbPixelByTagManager?: boolean;
    isEnablePixelTestEvent?: boolean;
    facebookPixelTestEventId?: string;
    tiktokPixelId?: string;
    tiktokAccessToken?: string;
    tiktokTestEventCode?: string;
    isPurchaseEventOnConfirm?: boolean;
  };
  courierMethods?: {
    providerName?: string;
    apiKey?: string;
    secretKey?: string;
    username?: string;
    password?: string;
    storeId?: string;
    status?: string;
    specialInstruction?: string;
  }[];
  fraudCheck?: {
    apiKey?: string;
    apiType?: 'free' | 'pro';
  };
  facebookCatalog?: {
    isEnableFacebookCatalog?: boolean;
  };
}
