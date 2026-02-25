export class ProfessionalClaimCheckResponse {
  hasMatch: boolean
  canClaim: boolean
  alreadyClaimedByYou: boolean
  claimedByAnotherUser: boolean
  professionalId: number | null
  professionalName: string | null
  dniNumber: string | null
  requiresSelection?: boolean
  nameMatches?: ProfessionalNameMatch[]
}

export class ProfessionalNameMatch {
  id: number
  name: string
}

export class ProfessionalClaimResponse {
  message: string
  professionalId: number
  ownerId: number | null
}
