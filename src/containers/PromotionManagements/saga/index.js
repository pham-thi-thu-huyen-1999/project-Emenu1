import { fork, all } from "redux-saga/effects"
import main from "./main"
export default function* rootSaga() {
  yield all([...main.map(saga => fork(saga))])
}