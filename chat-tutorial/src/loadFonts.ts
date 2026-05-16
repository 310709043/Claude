import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadDMMono } from "@remotion/google-fonts/DMMono";
import { loadFont as loadNotoSerifTC } from "@remotion/google-fonts/NotoSerifTC";
import { loadFont as loadNotoSansTC } from "@remotion/google-fonts/NotoSansTC";

loadInstrumentSerif();
loadInter("normal", { weights: ["400", "500", "600", "700"] });
loadDMMono("normal", { weights: ["400", "500"] });
loadNotoSerifTC("normal", { weights: ["400", "500", "600"] });
loadNotoSansTC("normal", { weights: ["400", "500", "600", "700"] });
