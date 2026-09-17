$base = "C:\Users\LENOVO\Desktop\veakay-handoff\super-admin-panel-repo\src\features\fraud"

function Write-File($relPath, $content) {
  $fullPath = Join-Path $base $relPath
  $dir = Split-Path $fullPath -Parent
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($fullPath, $content, [System.Text.Encoding]::UTF8)
  Write-Host "Wrote $relPath"
}

Write-File "types.ts" ("export type FraudFlagStatus = `"open`" | `"reviewing`" | `"resolved`" | `"dismissed`";" + "`n" +
"`n" +
'export type FraudFlagType =' + "`n" +
'  | `"frequent_profile_changes`"' + "`n" +
'  | `"payment_method_mismatch`"' + "`n" +
'  | `"withdrawal_anomaly`"' + "`n" +
'  | `"personal_info_mismatch`";' + "`n" +
"`n" +
'export type FraudFlagSeverity = `"low`" | `"medium`" | `"high`" | `"critical`";' + "`n" +
"`n" +
"export interface FraudFlag {" + "`n" +
"  id: string;" + "`n" +
"  userId: string;" + "`n" +
"  type: FraudFlagType;" + "`n" +
"  severity: FraudFlagSeverity;" + "`n" +
"  description: string;" + "`n" +
"  status: FraudFlagStatus;" + "`n" +
"  reviewedById: string | null;" + "`n" +
"  reviewedAt: string | null;" + "`n" +
"  resolutionNote: string | null;" + "`n" +
"  metadata: Record<string, unknown> | null;" + "`n" +
"  createdAt: string;" + "`n" +
"  updatedAt: string;" + "`n" +
"}"
)

Write-Host "Done"
