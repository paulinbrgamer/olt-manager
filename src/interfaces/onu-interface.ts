export interface OnuInfo {
    slot?: string | null;
    pon?: string | null;
    id?: string | null;
    name?: string | null;
    type?: string | null;
    configuredSpeedMode?: string | null;
    currentSpeedMode?: string | null;
    adminState?: string | null;
    phaseState?: string | null;
    serialNumber?: string | null;
    onuStatus?: string | null;
    omciBwProfile?: string | null;
    onuDistance?: string | null;
    onlineDuration?: string | null;
    fec?: string | null;
    fecActualMode?: string | null;
    lastDown?: string | null;
    signal?: number | null;
  }
  