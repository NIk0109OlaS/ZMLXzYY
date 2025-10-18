// 代码生成时间: 2025-10-19 06:40:12
import { serve } from 'https://deno.land/<v1.x/std/http/server.ts';
import { dirname, fromFileUrl } from 'https://deno.land/<v1.x/std/path/mod.ts';
import { copy } from 'https://deno.land/<v1.x/std/flags/mod.ts';

// Define the content distribution node class.
class CDNNode {
  private content: Record<string, string>;
  private nodeLinks: Record<string, string>;

  constructor() {
    this.content = {};
    this.nodeLinks = {};
  }

  // Add content to the node.
  addContent(key: string, content: string): void {
    this.content[key] = content;
  }

  // Retrieve content from the node.
  getContent(key: string): string | null {
    return this.content[key] || null;
  }

  // Register a new node.
  registerNode(key: string, url: string): void {
    this.nodeLinks[key] = url;
  }

  // Get a list of registered nodes.
  getNodes(): Record<string, string> {
    return this.nodeLinks;
  }
}

// Define the main CDN class that manages multiple nodes.
class CDNManager {
  private nodes: Record<string, CDNNode>;

  constructor() {
    this.nodes = {};
  }

  // Add a new node to the CDN.
  addNode(id: string, node: CDNNode): void {
    this.nodes[id] = node;
  }

  // Retrieve content from any node.
  async getContentFromCDN(key: string): Promise<string> {
    for (const id in this.nodes) {
      const content = this.nodes[id].getContent(key);
      if (content) {
        return content;
      }
    }
    throw new Error('Content not found in CDN');
  }
}

// Main function to set up and run the CDN.
async function main() {
  try {
    // Set up the CDN nodes.
    const node1 = new CDNNode();
    const node2 = new CDNNode();
    const manager = new CDNManager();
    manager.addNode('node1', node1);
    manager.addNode('node2', node2);

    // Add sample content to nodes.
    node1.addContent('hello', 'Hello from Node 1');
    node2.addContent('hello', 'Hello from Node 2');

    // Set up a simple HTTP server to handle requests.
    const server = serve({ port: 8000 });

    console.log('CDN server running on http://localhost:8000/');

    for await (const request of server) {
      switch (request.url) {
        case '/get-content': {
          const { key } = new URL(request.url, `http://${request.headers.get('host')}`).searchParams;
          const content = await manager.getContentFromCDN(key);
          request.respond({ status: 200, body: content });
          break;
        }
        default: {
          request.respond({ status: 404, body: 'Not Found' });
        }
      }
    }
  } catch (error) {
    console.error('CDN Server Error:', error);
  }
}

// Run the main function.
main();