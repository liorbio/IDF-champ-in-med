import { ReactNode } from "react";

export type ChildrenPropRfc = ({ children }: { children: ReactNode }) => JSX.Element | null;

export type QuestionRfc<QuestionData> = ({ data }: { data: QuestionData }) => JSX.Element | null;

export type LinkPropRfc = ({ link, label, icon }: { link: string, label?: string, icon?: string }) => JSX.Element | null;

export type HandlerPropRfc = ({ handler }: { handler: () => void }) => JSX.Element | null;

export type HandlerTogglerPropRfc = ({ handler, toggler }: { handler: () => void; toggler: () => void }) => JSX.Element | null;

export type HandlerWithObjArgTogglerPropRfc<InputsForHandler> = ({ handler, toggler }: { handler: (objArg: InputsForHandler) => void; toggler: () => void }) => JSX.Element | null;