import ky from "ky";
import { getBaseUrl } from "./utils";

export const api = ky.create({
  prefixUrl: getBaseUrl(),
});
