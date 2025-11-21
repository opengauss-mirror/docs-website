<script setup lang="ts">
import { computed } from 'vue';

import i18nConfig from '@/i18n';
import { ODivider } from '@opensig/opendesign';
import { getYearByOffset } from '@/utils/common';

import ContentWrapper from '@/components/ContentWrapper.vue';
import footerLogo from '@/assets/category/footer/footer-logo.svg';
import wechat from '@/assets/category/footer/wechat.svg';
import qrCode from '@/assets/category/footer/wechat.png';

import { useScreen } from '@/composables/useScreen';
import { useData } from 'vitepress';

const { lang } = useData();
const { gtPadV, lePadV } = useScreen();

const i18n = computed(() => i18nConfig.global.messages.value[lang.value as 'zh' | 'en']);
const footerNavs = computed(() => i18n.value.footer.FOOTER_NAVS);
const friendLinks = computed(() => i18n.value.footer.FRIENDLY_LINKS);
const optionsData = computed(() => i18n.value.footer.OPTIONS);

const baseUrl = import.meta.env.VITE_MAIN_DOMAIN_URL;
</script>

<template>
  <footer class="footer" id="tour_headerNav_footer">
    <ContentWrapper class="footer-wrap">
      <div class="footer-navs">
        <div v-for="item in footerNavs" :key="item.NAME" class="footer-navs-section" :class="`footer-navs-section-${lang}`">
          <p class="section-title">{{ item.NAME }}</p>

          <div class="section-links">
            <a v-for="link in item.LINKS" :key="link.NAME" :href="link.URL.includes('http') ? link.URL : `${baseUrl}${link.URL}`" class="link" target="_blank">{{ link.NAME }}</a>
          </div>
        </div>
      </div>

      <div class="friendly-link">
        <p class="friendly-link-title">{{ i18n.footer.LINK_TITLE }}</p>

        <div class="friendly-link-box">
          <a v-for="item in friendLinks" :key="item.NAME" :href="item.URL.includes('http') ? item.URL : `${baseUrl}${item.URL}`" class="friendly-link-item" target="_blank">{{ item.NAME }}</a>
        </div>
      </div>

      <ODivider class="divider-line" />

      <div class="footer-bottom">
        <div v-if="gtPadV" class="footer-left">
          <img class="logo" :src="footerLogo" alt="" />

          <a class="email-address" :href="'mailto:' + i18n.common.FOOTER.MAIL">
            {{ i18n.common.FOOTER.MAIL }}
          </a>
        </div>

        <div class="footer-middle">
          <div class="options-container">
            <div v-for="(option, index) in optionsData" :key="option.NAME" class="options-item">
              <a :href="option.URL.includes('http') ? option.URL : `${baseUrl}${option.URL}`" class="option-link" :target="option.TARGET" :rel="option.TARGET === '_blank' ? 'noopener noreferrer' : ''">
                {{ option.NAME }}
              </a>

              <ODivider v-if="index !== optionsData.length - 1" direction="v" class="divider-v" />
            </div>
          </div>

          <p class="copyright">
            {{ i18n.footer.COPY_RIGHT.replace('{year}', String(getYearByOffset())) }}
          </p>
        </div>

        <div v-if="lePadV" class="footer-left-mb">
          <img class="logo" :src="footerLogo" alt="" />

          <a class="email-address" :href="'mailto:' + i18n.common.FOOTER.MAIL">
            {{ i18n.common.FOOTER.MAIL }}
          </a>
        </div>

        <div v-if="gtPadV" class="footer-right">
          <div class="code-box">
            <img :src="wechat" alt="" class="code-img" />

            <p class="code-txt">{{ i18n.footer.OFFICIAL_ACCOUNT }}</p>

            <div class="code-layer">
              <img :src="qrCode" alt="" class="qrcode-img" />
            </div>
          </div>
        </div>

        <div v-if="lePadV" class="qrcode-box-mb">
          <img :src="qrCode" alt="" class="qrcode-img" />
          <p class="qrcode-desc">
            {{ i18n.footer.OFFICIAL_ACCOUNT }}
          </p>
        </div>
      </div>
    </ContentWrapper>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background: #121212;
}

.footer-wrap {
  padding-top: 32px;
  padding-bottom: 16px;
  background-image: url('@/assets/category/footer/footer-bg.png');
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 1428px;

  @include respond-to('<=laptop') {
    background-size: 100%;
    padding-top: 24px;
    padding-bottom: 12px;
  }

  @include respond-to('pad') {
    padding-top: 16px;
    padding-bottom: 8px;
  }

  @include respond-to('phone') {
    background-image: none;
    padding-top: 24px;
    padding-bottom: 24px;
  }
}

a {
  cursor: pointer;
}

.footer-navs {
  display: flex;
  justify-content: center;

  @include respond-to('<=pad') {
    justify-content: space-between;
  }

  .footer-navs-section {
    & + .footer-navs-section {
      margin-left: 80px;
    }

    .section-title {
      margin-bottom: 10px;
      color: var(--o-color-white);
      @include h4;
    }

    .section-links {
      display: flex;
      flex-direction: column;

      .link {
        color: rgba(var(--o-white), 0.8);
        @include tip1;

        @include hover {
          color: var(--o-color-white);
        }

        & + .link {
          margin-top: 8px;
        }
      }
    }
  }

  @include respond-to('laptop') {
    .footer-navs-section {
      .section-title {
        @include text2;
      }
    }

    .footer-navs-section-en {
      & + .footer-navs-section-en {
        margin-left: 60px;
      }
    }
  }

  @include respond-to('pad_h') {
    .footer-navs-section {
      .section-title {
        @include text1;
      }

      .section-links {
        .link {
          @include tip2;
        }
      }
    }
  }

  @include respond-to('<=pad_v') {
    display: none;
  }

  @include respond-to('<=pad') {
    .footer-navs-section {
      & + .footer-navs-section {
        margin-left: 0;
      }
    }
  }
}

.friendly-link {
  margin-top: 48px;
  display: flex;
  align-items: center;
  @include tip2;

  .friendly-link-title {
    color: var(--o-color-white);
    margin-right: 24px;
  }

  .friendly-link-box {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
  }

  .friendly-link-item {
    color: rgba(var(--o-white), 0.6);
    margin-right: 24px;
    white-space: nowrap;

    @include hover {
      color: var(--o-color-white);
    }

    &:last-child {
      margin-right: 0;
    }
  }

  @include respond-to('laptop') {
    margin-top: 40px;

    .friendly-link-item {
      margin-right: 16px;
    }
  }

  @include respond-to('pad_h') {
    margin-top: 24px;

    .friendly-link-item {
      margin-right: 12px;
    }
  }

  @include respond-to('<=pad_v') {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 0;

    .friendly-link-title {
      margin-bottom: 12px;
    }

    .friendly-link-box {
      margin-top: -4px;
      margin-right: -8px;
    }

    .friendly-link-item {
      margin-top: 4px;
      margin-right: 8px;
    }
  }
}

.divider-line {
  --o-divider-bd-color: rgba(var(--o-white), 0.15);

  @include respond-to('<=pad_v') {
    --o-divider-gap: 16px;
  }
}

.divider-v {
  --o-divider-bd-color: var(--o-color-white);
  height: 14px;

  @include respond-to('<=pad_v') {
    --o-divider-gap: 8px;
    height: 12px;
  }
}

.footer-bottom {
  padding: 13px 0;
  display: flex;
  justify-content: space-between;

  @include respond-to('pad_h') {
    padding: 16px 0;
  }

  @include respond-to('<=pad_v') {
    flex-direction: column;
    align-items: center;
    padding: 8px 0 0;
  }

  @include respond-to('phone') {
    padding: 0;
  }
}

.footer-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .logo {
    height: 26px;

    @include respond-to('<=pad_v') {
      height: 20px;
    }
  }

  .email-address {
    color: var(--o-color-white);
    @include tip1;

    @include respond-to('<=pad_v') {
      font-size: 8px;
      line-height: 22px;
    }
  }
}

.footer-left-mb {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 12px;

  .logo {
    height: 20px;
    margin-bottom: 4px;
  }

  .email-address {
    color: var(--o-color-white);
    font-size: 8px;
    line-height: 22px;
  }
}

.options-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  .option-link {
    color: var(--o-color-white);
    @include tip1;

    @include respond-to('<=pad_v') {
      font-size: 10px;
      line-height: 16px;
    }
  }
}

.copyright {
  margin-top: 6px;
  text-align: center;
  color: rgba(178, 178, 178, 1);
  @include tip1;

  @include respond-to('<=pad_v') {
    font-size: 10px;
    line-height: 16px;
  }
}

.footer-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: right;

  .code-box {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;

    @include hover {
      .code-layer {
        display: block;
      }
    }

    .code-layer {
      position: absolute;
      top: -95px;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px;
      border-radius: 4px;
      background-color: var(--o-color-fill2);
      display: none;

      &::after {
        border: 10px solid transparent;
        content: '';
        border-top-color: #fff;
        position: absolute;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
        display: block;
      }

      .qrcode-img {
        width: 78px;
      }
    }

    .code-img {
      height: 22px;
      margin-right: 8px;
    }

    .code-txt {
      color: rgba(132, 132, 132, 1);
      @include tip2;
    }
  }
}

.qrcode-box-mb {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .qrcode-img {
    width: 78px;
  }

  .qrcode-desc {
    margin-top: 8px;
    text-align: center;
    color: var(--o-color-white);
    @include tip2;
  }
}
</style>
