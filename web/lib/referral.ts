// 어스2 리퍼럴 코드 — 단일 소스 (single source of truth)
// 링크형이 아니라 결제 마지막 단계에서 쿠폰처럼 수동 입력하는 코드. 정보 전달용.
// 값은 .env 의 NEXT_PUBLIC_REFERRAL_CODE 로 덮어쓸 수 있고, 없으면 기본값 사용.
export const REFERRAL_CODE = process.env.NEXT_PUBLIC_REFERRAL_CODE || '00000'
export const REFERRAL_DISCOUNT = '7.5%'
export const EARTH2_APP_URL = 'https://app.earth2.io'
