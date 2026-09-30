/**
 * @file types.ts
 * @description Internationalization (i18n) types and enterprise translation schema for Runawulf.
 */

export type SupportedLocale = 'en' | 'es' | 'de';

export interface LanguageInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
}

export interface TranslationDictionary {
  nav: {
    dashboard: string;
    firewall: string;
    intrusion: string;
    telemetry: string;
    audit: string;
    settings: string;
    version: string;
  };
  header: {
    statusConnected: string;
    postureLabel: string;
    switchPosture: string;
    selectLanguage: string;
  };
  modes: {
    guardian: {
      name: string;
      tagline: string;
      description: string;
      themeLabel: string;
    };
    watcher: {
      name: string;
      tagline: string;
      description: string;
      themeLabel: string;
    };
    lockdown: {
      name: string;
      tagline: string;
      description: string;
      themeLabel: string;
    };
  };
  views: {
    guardian: {
      title: string;
      badge: string;
      defenseNominal: string;
      telemetryTitle: string;
      cpuTitle: string;
      memTitle: string;
      ipcTitle: string;
      loadTitle: string;
      firewallOverview: string;
      activeSetsTitle: string;
      threatStatus: string;
    };
    watcher: {
      title: string;
      badge: string;
      streamTitle: string;
      streamSubtitle: string;
      filterPlaceholder: string;
      eventsCaptured: string;
      suricataVersion: string;
      exportLogs: string;
      tableTime: string;
      tableSeverity: string;
      tableSource: string;
      tableSignature: string;
      tableAction: string;
    };
    lockdown: {
      title: string;
      badge: string;
      alertMessage: string;
      rollbackWatchdog: string;
      rollbackSecondsRemaining: string;
      commitAction: string;
      rollbackAction: string;
      quarantineTitle: string;
      portsIsolated: string;
      emergencyDropAll: string;
    };
  };
  onboarding: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    btnNext: string;
    btnBack: string;
    btnArm: string;
    interfaceDetected: string;
    evePathLabel: string;
    postureSelectLabel: string;
    hmacKeyReady: string;
    completeNotice: string;
  };
  common: {
    active: string;
    cancel: string;
    confirm: string;
    systemNominal: string;
    live: string;
  };
}
