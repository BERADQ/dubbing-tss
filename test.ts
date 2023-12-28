import { DubbingClient } from "./src";

const accessKey = "";
const secretKey = "";

const client = new DubbingClient(accessKey, secretKey);

client.createTask({
  text: "你好你好", //待转换文本 长度最大800
  speakerId: 71, //音色id 具体见发音人列表
  speed: 1.0, //播放速度 0.1-2.5
  volume: 2, //音量 0-3
  sampleRate: 16000, //采样率 16000 24000 48000  0：系统自动取客户可用的最大采样率
}).then(async (t) => {
  const out = await t.getOutUrl();
  console.log(out);
});
