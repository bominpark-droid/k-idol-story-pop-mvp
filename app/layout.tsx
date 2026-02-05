export const metadata = {
  title: 'K-Idol Story Pop MVP',
  description: 'AI 아이돌과 대화해보세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
