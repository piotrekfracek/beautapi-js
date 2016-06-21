import Api         from "./api";
import ParseJSON   from "./helpers/parseJSON";
import mapTo       from "./helpers/mapTo";
import decorateTo  from "./helpers/decorateTo";
import throwErrors from "./helpers/throwErrors";

export default {
  parse: Api.parse,
  helpers: {
    parseJSON:   ParseJSON,
    mapTo:       mapTo,
    decorateTo:  decorateTo,
    throwErrors: throwErrors
  }
}
