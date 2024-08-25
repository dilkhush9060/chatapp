export type SignInFlow = "signUp" | "signIn";
export interface SignInFlowProps {
  setState: (state: SignInFlow) => void;
}
