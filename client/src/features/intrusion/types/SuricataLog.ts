export type SuricataLog =
  | {
      tipo: "alert";
      timestamp: string;
      src_ip: string;
      dest_ip: string;
      proto: string;
      alerta: string;
      dest_port?: number
    }
  | {
      tipo: "http";
      timestamp: string;
      src_ip: string;
      dest_ip: string;
      url: string;
      status: number;
    }
  | {
      tipo: "dns";
      timestamp: string;
      src_ip: string;
      dest_ip: string;
      query: string;
      type: string;
    };
