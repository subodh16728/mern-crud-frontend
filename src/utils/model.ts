export interface Feature {
    title: string;
    value: string;
    [props: string]: string;
}

export interface SingleProduct {
    name: string;
    category: string;
    price: string;
    description: string;
    features: Array<Feature>; // Product.features Array<Feature> = event.taret.value (string)
}

// index signature: when how many data are going to be received are unknown
export interface ErrorContainer {
    [props: string]: string;
}

export type FeatureProp = {
    data: Feature;
    index: number;
    onChange: Function;
    onDelete: Function;
    submitted: boolean
};

export interface HandleChangeFeature {
    index: number;
    name: string;
    value: string;
}

export interface Loading {
    loading: boolean;
}

// --------------------------------------------------- redux interface and types -------------------------------------------

export type UserDataContainer = {
    [props: string]: string;
};

export interface UserData {
    [props: string]: string;
}

export interface RegisterActionPayload {
    data: UserData;
    error: boolean;
    message: boolean;
    success: string;
}

export interface UserInitialState {
    isLoading: boolean;
    isError: boolean;
    name: string;
    data: RegisterActionPayload
};

// --------------------------------------------------- Bookmarks.tsx -------------------------------------------

export interface DefaultProductStructure {
    [props: number | string]: object | any;
}

// --------------------------------------------------- Dashboard.tsx -------------------------------------------
export interface JwtHeader {
    _id: string;
}

export interface RestParameter {
    [props: string]: any
}

// --------------------------------------------------- Offers.tsx -------------------------------------------
export interface SingleOffer {
    [props: string]: string;
}

// --------------------------------------------------- Product.tsx -------------------------------------------
