import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export interface MetaProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  twitter?: string
  twitterCard?: string
  twitterSite?: string
  twitterCreator?: string
  ogType?: string
  ogSiteName?: string
  ogTitle?: string
  ogDescription?: string
  ogImageUrl?: string
  ogUrl?: string
  fbAppId?: string
}

/**
 * NextJS Head Component implementation is buggy. You can't extract these items in subcomponents,
 * as they appear in the HTML output but once re-hydration happens, they are lost.
 * @param title
 * @param description
 * @param ogDescription
 * @param ogTitle
 * @param ogType
 * @param ogUrl
 * @param ogImageUrl
 * @constructor
 */
const Metadata = ({
  title,
  description,
  ogDescription = 'Last Man Standing',
  ogTitle = '',
  ogType = '',
  ogUrl = '',
  ogImageUrl = '',
}: MetaProps) => {
  const { locale, query } = useRouter()

  const titleWithPageNumber = title || 'Last Man Standing'

  return (
    <Head>
      <title>{`${titleWithPageNumber} - Last Man Standing`}</title>

      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      ></meta>
      <meta property="product:price:amount" content="0.00" />
      <meta property="product:price:currency" content="USD" />
      <link rel="shortcut icon" href={`/logo/game-logo.png`} type="image/png" />

      <meta property="og:site_name" content="Last Man Standing" />
      <meta property="og:locale" content={'en'} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={`${ogTitle || title} - Last Man Standing`} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={ogUrl} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@LastManStanding" />
      <meta name="twitter:creator" content="@LastManStanding" />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:title" content={`${ogTitle || title} - Last Man Standing`} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Head>
  )
}

export default Metadata
