const initialState = {
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: {
          displayName: action.payload.displayName,
          email: action.payload.email,
          emailVerified: action.payload.emailVerified,
          phoneNumber: action.payload.phoneNumber,
          photoURL: action.payload.photoURL,
          providerId: action.payload.providerId,
          uid: action.payload.uid,
          // Convert metadata timestamps to numbers if needed
          metadata: {
            creationTime: action.payload.metadata?.creationTime ?? null,
            lastSignInTime: action.payload.metadata?.lastSignInTime ?? null,
          },
        },
      };
    case "CLEAR_USER":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;
