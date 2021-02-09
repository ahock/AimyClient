interface AppConfig {
  clientID: string;
  storageURL: string;
  apiVersion: string;
  version: string;
  releaseComment: string;
  daylightSavingTime: string;
  togPlaylist: boolean;
  togSkillCat: boolean;
  togStatus: boolean;
  togShareContent: boolean;
  togRateContent: boolean;
  togEduoShowAchievement: boolean;
  togSkillShowMetric: boolean;
  togSkillShowStat: boolean;
  textPlanDescription: string[];
  defaultGroups: string[];
}

export const APP_CONFIG: AppConfig = {
  clientID: 'gb2306fpDknAcuITs3Mf5V73R0MsibOg',
  // Development API Gateway
//  storageURL: 'http://storage.aimyonline.com:8080',
  // Showcase  API Gateway
  storageURL: 'http://3.121.45.234:3000',
  // Production  API Gateway
  
  apiVersion: '0.0.1',
  version: '0.1.0.2',
  releaseComment: 'Fix resume assignment',
  daylightSavingTime: '+0100',
  // Feature toggler activate or deactivate a specific functionality
  togStatus: false,
  togPlaylist: false, // play list functions in main menue and learning content 
  togSkillCat: false, // Content button
  togShareContent: false, // Content button
  togRateContent: false, // Content button
  togEduoShowAchievement: false,
  togSkillShowMetric: false, // Detail figures like rating, test and more
  togSkillShowStat: false, // Show Skill statistic
  textPlanDescription: [
    "Der frei Plan ermöglicht das kostenfrei Ausprobieren von Aimy. Sie haben Zugriff auf alle freien Kompetenzen, Lernziele und Lernmittel. Wenn nicht gesondert vermerkt, verhalten sich alle Funktionen so wie bei den anderen Varianten. Ein Umstieg ist jederzeit möglich.",
    "Das Monatsabonnement schliesst, neben den freien Kompetenzen, Lernziele und Lernmittel, den Zugang zu einer Zahl stetig wachsender Angebote ein. Es können zusätzlich Kosten für exklisive Inhalte von Partnern anfallen.",
    "Speziell für das Bildungszentrum kv pro zusammengestellte Kompetenzen, Lernziele und Lernmittel.",
    "Speziell für Firmen zusammengestellte Kompetenzen, Lernziele und Lernmittel."
  ],
  defaultGroups: ["dswi18h","user2021"]
};

interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'Mf5V73R0MsibOggb2306fpDknAcuITs3',
  domain: 'iod.eu.auth0.com',
  
//  callbackURL: 'http://www.aimyonline.com/#comp2'
//  callbackURL: 'http://aimyp.s3-website.eu-central-1.amazonaws.com/#comp2'
//  callbackURL: 'http://aimyc.s3-website.eu-central-1.amazonaws.com/#comp2'
  callbackURL: 'http://showcase.aimyonline.com:8080/comp2'
  
};