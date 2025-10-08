// 代码生成时间: 2025-10-09 02:37:25
import { assertEquals, assert } from 'https://deno.land/std@0.139.0/testing/asserts.ts';
import { NFT } from './models/nft.ts';
import { EthereumService } from './services/ethereum_service.ts';
import { NFTStorageService } from './services/nft_storage_service.ts';
import { Logger } from './utils/logger.ts';

// NFT铸造平台主类
class NFTPlatform {
  private ethereumService: EthereumService;
  private nftStorageService: NFTStorageService;
  private logger: Logger;

  constructor() {
    this.ethereumService = new EthereumService();
    this.nftStorageService = new NFTStorageService();
    this.logger = new Logger();
  }

  // 铸造一个NFT
  async mintNFT(metadata: Record<string, unknown>, image: File): Promise<NFT> {
    try {
      const nftMetadata = await this.nftStorageService.uploadMetadata(metadata);
      const nftImage = await this.nftStorageService.uploadImage(image);
      const nft = new NFT(nftMetadata, nftImage);
      const receipt = await this.ethereumService.mint(nft);
      this.logger.info(`NFT minted successfully: ${receipt.transactionHash}`);
      return nft;
    } catch (error) {
      this.logger.error(`Error minting NFT: ${error}`);
      throw error;
    }
  }

  // 获取NFT列表
  async getNFTList(): Promise<NFT[]> {
    try {
      const nfts = await this.nftStorageService.listNFTs();
      this.logger.info('NFT list retrieved successfully');
      return nfts;
    } catch (error) {
      this.logger.error(`Error retrieving NFT list: ${error}`);
      throw error;
    }
  }
}

// 测试NFT铸造平台
async function testNFTPlatform() {
  const platform = new NFTPlatform();
  const metadata = {
    name: 'Test NFT',
    description: 'This is a test NFT from the NFT platform.',
  };
  const image = new File([new ArrayBuffer(0)], 'image.png', { type: 'image/png' });
  const nft = await platform.mintNFT(metadata, image);
  assertEquals(nft.name, metadata.name);
  assertEquals(nft.description, metadata.description);
}

testNFTPlatform();