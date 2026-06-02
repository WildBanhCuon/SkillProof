import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { lookup } from 'dns/promises';
import { isIPv4, isIPv6 } from 'net';

export interface PageExcerpt {
  url: string;
  text: string;
}

const MAX_RESPONSE_BYTES = 2_000_000;
const FETCH_TIMEOUT_MS = 12_000;
const MAX_EXCERPT_CHARS = 6_000;
const MAX_TOTAL_CHARS = 14_000;

const ABOUT_PATHS = ['/', '/about', '/about-us', '/a-propos', '/team', '/company'];

@Injectable()
export class WebpageFetchService {
  private readonly logger = new Logger(WebpageFetchService.name);

  normalizeWebsiteUrl(input: string): string {
    let raw = input.trim();
    if (!raw) {
      throw new BadRequestException('Website URL is required');
    }
    if (!/^https?:\/\//i.test(raw)) {
      raw = `https://${raw}`;
    }
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      throw new BadRequestException('Invalid website URL');
    }
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new BadRequestException('Only http and https URLs are allowed');
    }
    if (url.username || url.password) {
      throw new BadRequestException('URL must not include credentials');
    }
    const port = url.port ? parseInt(url.port, 10) : url.protocol === 'https:' ? 443 : 80;
    if (![80, 443].includes(port)) {
      throw new BadRequestException('Only standard HTTP ports are allowed');
    }
    return url.origin;
  }

  async collectPublicText(websiteInput: string): Promise<PageExcerpt[]> {
    const origin = this.normalizeWebsiteUrl(websiteInput);
    await this.assertPublicHost(origin);

    const excerpts: PageExcerpt[] = [];
    let totalChars = 0;

    for (const path of ABOUT_PATHS) {
      if (totalChars >= MAX_TOTAL_CHARS) break;
      const pageUrl = path === '/' ? `${origin}/` : `${origin}${path}`;
      try {
        const html = await this.fetchHtml(pageUrl);
        const text = this.htmlToText(html).slice(0, MAX_EXCERPT_CHARS);
        if (text.length < 80) continue;
        excerpts.push({ url: pageUrl, text });
        totalChars += text.length;
      } catch (err) {
        this.logger.debug(`Skip ${pageUrl}: ${String(err)}`);
      }
    }

    if (excerpts.length === 0) {
      throw new BadRequestException(
        'Could not read useful text from that website. Check the URL or write the description manually.',
      );
    }

    return excerpts;
  }

  private async assertPublicHost(origin: string): Promise<void> {
    const hostname = new URL(origin).hostname.toLowerCase();
    const blocked = ['localhost', '127.0.0.1', '0.0.0.0', '[::1]', 'metadata.google.internal'];
    if (blocked.includes(hostname) || hostname.endsWith('.local')) {
      throw new BadRequestException('That host is not allowed');
    }

    const records = await lookup(hostname, { all: true });
    for (const { address } of records) {
      if (this.isBlockedIp(address)) {
        throw new BadRequestException('That host is not allowed');
      }
    }
  }

  private isBlockedIp(ip: string): boolean {
    const normalized = ip.toLowerCase();
    if (normalized === '::1' || normalized === '127.0.0.1' || normalized === '0.0.0.0') {
      return true;
    }
    if (isIPv4(normalized)) {
      const [a, b] = normalized.split('.').map((x) => parseInt(x, 10));
      if (a === 10 || a === 127 || a === 0) return true;
      if (a === 169 && b === 254) return true;
      if (a === 172 && b >= 16 && b <= 31) return true;
      if (a === 192 && b === 168) return true;
    }
    if (isIPv6(normalized)) {
      if (
        normalized.startsWith('fc') ||
        normalized.startsWith('fd') ||
        normalized.startsWith('fe80') ||
        normalized.startsWith('::ffff:127.')
      ) {
        return true;
      }
    }
    return false;
  }

  private async fetchHtml(url: string): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': 'SkillProofBot/1.0 (+https://skillproof.local; company-profile-draft)',
          Accept: 'text/html,application/xhtml+xml',
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const contentType = res.headers.get('content-type') ?? '';
      if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
        throw new Error(`Unsupported content type: ${contentType}`);
      }
      const buf = await res.arrayBuffer();
      if (buf.byteLength > MAX_RESPONSE_BYTES) {
        throw new Error('Response too large');
      }
      return new TextDecoder('utf-8', { fatal: false }).decode(buf);
    } finally {
      clearTimeout(timer);
    }
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
      .replace(/\s+/g, ' ')
      .trim();
  }
}
