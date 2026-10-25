// Convert complete generated assets to web formats; never extract or crop a collection image.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
const sourceRoot = process.argv[2];
if (!sourceRoot) throw new Error('Pass the directory containing the original generated PNGs.');
const sources = {
  "men-1-front": "exec-596b741c-2702-4101-ac4f-a34e9fb3a2f7.png",
  "men-1-left": "exec-923f6206-c7cc-43a7-99f6-8d2c2606924f.png",
  "men-1-right": "exec-ca8e4481-5637-4da5-b3f4-adbcd4c2c14e.png",
  "men-2-front": "exec-3bea7895-2775-4913-999b-dc7cd6df8e3b.png",
  "men-2-left": "exec-ea5ad423-1e74-408e-aa60-10bb58445db0.png",
  "men-2-right": "exec-e5e5150e-cec3-416a-a85d-4fd7ca9ecf1d.png",
  "men-3-front": "exec-3a2583b1-a558-42d9-9e39-73dcdaacb98c.png",
  "men-3-left": "exec-9ef8041b-2595-447f-9f52-65f4dad27003.png",
  "men-3-right": "exec-6e3821c5-0c42-44c1-81dd-885dfb72e935.png",
  "men-4-front": "exec-b4364cc4-15a6-4a76-96be-d59eeabf0945.png",
  "men-4-left": "exec-f92ca2bf-9762-4c35-9f86-9a9bce4a6208.png",
  "men-4-right": "exec-a3484b9a-5b14-4618-a3de-38ddf0657021.png",
  "men-5-front": "exec-7f8d61e5-70c5-4a2b-babd-b9aac54e9efc.png",
  "men-5-left": "exec-bcce92e0-2b07-4c25-956e-964889f528ba.png",
  "men-5-right": "exec-74a7a4fe-471f-4a9a-849b-a6b98bdaedf3.png",
  "women-1-front": "exec-37b75cd1-0456-4d18-b9ef-e5b54548913c.png",
  "women-1-left": "exec-10283607-0cd5-4dc6-bfe3-974f4c49a1c4.png",
  "women-1-right": "exec-86f0c460-533d-4861-ac4e-8fec5a0a0b4b.png",
  "women-2-front": "exec-656e3c20-9bb8-42f5-b81f-4d30d4b3f1c7.png",
  "women-2-left": "exec-c5727294-d455-4c86-9b6a-d21c46f0c036.png",
  "women-2-right": "exec-3386ac21-1b15-418e-8c68-3fc7b752ef64.png",
  "women-3-front": "exec-10bd8891-e948-4660-ad3d-acc748a21b99.png",
  "women-3-left": "exec-84afab7e-fd62-4cb8-95e6-291500c3afeb.png",
  "women-3-right": "exec-a8122577-d2a9-4567-b4d0-8245164820f9.png",
  "women-4-front": "exec-587bd9cd-4b01-4617-b154-b2728eb8597b.png",
  "women-4-left": "exec-311c6936-c666-4fb9-b416-0e4c56a452eb.png",
  "women-4-right": "exec-5810d2e6-051e-44a7-bde4-75b80c9663b7.png",
  "women-5-front": "exec-854c24fa-8692-48e2-bd87-1448dfa68415.png",
  "women-5-left": "exec-32980cba-fcd7-44c8-aded-d16f8a3979fc.png",
  "women-5-right": "exec-e9e2fb57-8a12-4a2b-90b3-de1d94c488f0.png",
  "girls-1-front": "exec-33b54816-f381-4f77-8518-638835ac91df.png",
  "girls-1-left": "exec-d68c8750-28d2-4649-a981-388b68eb9841.png",
  "girls-1-right": "exec-1030d380-678a-4038-9e16-b39311b2aa15.png",
  "girls-2-front": "exec-cc4721c8-80d0-488c-8064-f96a1652f60a.png",
  "girls-2-left": "exec-39bb2383-a23e-4d6a-a88e-87f8c5cf4732.png",
  "girls-2-right": "exec-eacd5145-01a3-4ab7-8a06-9e57e0359cdc.png",
  "girls-3-front": "exec-b97fe6aa-c229-422e-b4b5-69a72e489b6c.png",
  "girls-3-left": "exec-df480a77-9e53-4335-bc5a-e3ee5635b221.png",
  "girls-3-right": "exec-51986282-74dd-445b-9bc6-0048a8bc926f.png",
  "girls-4-front": "exec-d9d87902-ab31-4b44-864f-508d1a187a37.png",
  "girls-4-left": "exec-01178ef8-2f71-4889-a2a2-1645d7fb97bc.png",
  "girls-4-right": "exec-bbfa6e9b-c990-4fbb-9720-4cf713c94ee1.png",
  "girls-5-front": "exec-4c55e342-4a91-49f7-bc52-474388ca9d1b.png",
  "girls-5-left": "exec-dbcd8a2f-5eb7-4362-bf86-9a9e916a1f3e.png",
  "girls-5-right": "exec-c49ed6a0-5c95-41ff-bcb2-1b0c7ad46db1.png",
  "boys-1-front": "exec-4d14fded-fb95-485f-8ced-ea9386fc4bf3.png",
  "boys-1-left": "exec-2992104a-9692-48c5-bf7a-ed7d7e90bed1.png",
  "boys-1-right": "exec-386fa1f9-5728-4e40-8bf8-9426ef39ae37.png",
  "boys-2-front": "exec-1db073c4-05b4-4183-98ac-850ebd0f2fd5.png",
  "boys-2-left": "exec-84b25926-1e97-4972-bb26-58f9ccf0dc29.png",
  "boys-2-right": "exec-9e679391-a5d1-4be1-a8bb-c13b6655e1f9.png",
  "boys-3-front": "exec-cf37ac26-7571-411e-a3c9-df3800d91265.png",
  "boys-3-left": "exec-349903e1-435f-4b80-88aa-5bae409800cd.png",
  "boys-3-right": "exec-04de84f1-3e3e-4445-b678-f3089be871e8.png",
  "boys-4-front": "exec-4bf1b146-e145-4fc0-aa07-b0d8877f1113.png",
  "boys-4-left": "exec-4b73a678-21c7-4dfc-85ac-2c2dce090da9.png",
  "boys-4-right": "exec-c0ff1e95-dfeb-4a51-b8b9-6c296eb8e21a.png",
  "boys-5-front": "exec-8d7559eb-cafa-4118-96b8-21f9de242784.png",
  "boys-5-left": "exec-c32c499a-5de8-47c0-aee0-ae803dd67c24.png",
  "boys-5-right": "exec-7d4e55f7-0c83-4570-ba35-90dd43db9228.png"
};
const destination = path.resolve('public/garments');
await fs.mkdir(destination, { recursive: true });
let inputBytes = 0, outputBytes = 0;
for (const [name, filename] of Object.entries(sources)) {
  const source = path.join(sourceRoot, filename);
  const meta = await sharp(source).metadata();
  if (!meta.hasAlpha) throw new Error(name + ' has no transparent channel');
  inputBytes += (await fs.stat(source)).size;
  const full = path.join(destination, name + '.webp');
  await sharp(source).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 100, effort: 5 }).toFile(full);
  outputBytes += (await fs.stat(full)).size;
  if (name.endsWith('-front')) {
    await sharp(source).resize({ width: 360, withoutEnlargement: true }).webp({ quality: 85, alphaQuality: 100, effort: 5 }).toFile(path.join(destination, name.replace('-front', '-rack') + '.webp'));
  }
}
console.log(JSON.stringify({ images: Object.keys(sources).length, inputMB: (inputBytes / 1e6).toFixed(1), webpMB: (outputBytes / 1e6).toFixed(1) }));

