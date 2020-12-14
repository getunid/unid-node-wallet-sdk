interface PostalAddress {
    '@type': 'PostalAddress',
    addressCountry: string,
    addressLocality: string,
    addressRegion: string,
    postalCode: string,
    streetAddress: string,
}

interface AddressPerson {
    '@type': 'AddressPerson',
    address: PostalAddress,
}

// AddressCredentialV1

interface AddressOrganization {
    '@type': 'AddressOrganization',
    address: PostalAddress,
}

// AddressCredentialV1