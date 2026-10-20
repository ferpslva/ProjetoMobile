import { Platform } from 'react-native';

const ENDERECO_DO_PC_NA_REDE: string | null = null;

const PORTA_DA_API = 8080;

const host =
  ENDERECO_DO_PC_NA_REDE ??
  (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');

export const API_BASE_URL = `http://${host}:${PORTA_DA_API}`;

export const TEMPO_LIMITE_MS = 10000;