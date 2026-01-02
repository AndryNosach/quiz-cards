import { useSelector } from "react-redux";
import { translations } from "../i18n/translations";

export const useTranslate = () => {
    const lang = useSelector((state) => state.language.lang);

    return (key) => translations[lang][key] || key;
};