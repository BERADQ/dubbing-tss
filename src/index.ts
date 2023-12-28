import { signatureDubbing } from "./net_util";
export class DubbingClient {
  private key: KeyClusters;
  constructor(accessKey: string, secretKey: string) {
    this.key = { accessKey, secretKey };
  }
  async createTask(option: TTSConfig): Promise<DubbingTask> {
    const body = JSON.stringify(option);
    const authorization: string = await signatureDubbing(
      "POST",
      "/api/ttsra/createTask",
      this.key.accessKey,
      this.key.secretKey,
      body,
    );
    const res = await fetch(
      "https://console.dubbing.tech/api/ttsra/createTask",
      {
        method: "POST",
        body,
        headers: {
          "Authorization": `Dubbing ${authorization}`,
          "Content-Type": "application/json",
        },
      },
    );
    const data = await res.json();
    return new DubbingTask(data.data.id, this.key);
  }
}

export class DubbingTask {
  id: number;
  key: KeyClusters;
  constructor(id: number, key_clusters: KeyClusters) {
    this.id = id;
    this.key = key_clusters;
  }
  async getOutUrl(): Promise<string> {
    const authorization: string = await signatureDubbing(
      "GET",
      "/api/ttsra/getTask",
      this.key.accessKey,
      this.key.secretKey,
    );
    const res = await fetch(
      `https://console.dubbing.tech/api/ttsra/getTask?id=${this.id}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Dubbing ${authorization}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    const data = await res.json();
    return data.data.url;
  }
}

interface KeyClusters {
  accessKey: string;
  secretKey: string;
}
interface TTSConfig {
  text: string; //待转换文本 长度最大800
  speakerId: number; //音色id 具体见发音人列表
  speed: number; //播放速度 0.1-2.5
  volume: number; //音量 0-3
  sampleRate: number; //采样率 16000 24000 48000  0：系统自动取客户可用的最大采样率
  callbackUrl?: string; //转换成功后回调地址 可选填 填写该参数时，请按照3.2签名验证文档验签和获得转换数据。如果不填写该字段可使用查询转换任务接口/ttsra/getTask获得转换结果，详见4.2说明
}
