import {
  CONSTCFG
} from "./const";

var IP = CONSTCFG.IP;
var AppId = CONSTCFG.AppId;
var LoginIP = CONSTCFG.LoginIP;
var SrvIP = CONSTCFG.SrvIP;

export const services = {
  sys: {
    login: `http://${LoginIP}/Account/Login`,
  },
  data: {
    company: `http://${SrvIP}/companies`,
    projectset: `http://${SrvIP}/projectRoots`,
    project: `http://${SrvIP}/projects`,
    application: `http://${SrvIP}/applications`,
    documents: `http://${SrvIP}/documents`,
    certs: `http://${SrvIP}/certs`,
  },
  dictionary: {
    all: `http://${SrvIP}/datadictionary/0/subitems`,
  },

};