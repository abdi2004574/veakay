import { describe, it, expect, vi, beforeEach } from "vitest";
import { getFraudFlags, getFraudFlag, reviewFraudFlag } from "./fraud";
import type { FraudFlag } from "../types";

vi.mock("../../../utils/api", () => ({
  getApi: vi.fn(),
  patchApi: vi.fn(),
}));

import { getApi, patchApi } from "../../../utils/api";

const mockFlags: FraudFlag[] = [
  {
    id: "flag-1",
    userId: "user-1",
    type: "withdrawal_anomaly",
    severity: "high",
    description: "Test flag 1",
    status: "open",
    reviewedById: null,
    reviewedAt: null,
    resolutionNote: null,
    metadata: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

describe("getFraudFlags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated flags with filters", async () => {
    const response = {
      success: true,
      data: { items: mockFlags, nextCursor: null },
    };
    (getApi as ReturnType<typeof vi.fn>).mockResolvedValue(response);

    const result = await getFraudFlags({ status: "open", limit: 20 });

    expect(getApi).toHaveBeenCalledWith("/admin/fraud/flags", {
      status: "open",
      limit: "20",
    });
    expect(result.success).toBe(true);
    expect(result.data.items).toHaveLength(1);
    expect(result.data.nextCursor).toBeNull();
  });
});

describe("getFraudFlag", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a single flag by id", async () => {
    const flag = mockFlags[0];
    (getApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      data: flag,
    });

    const result = await getFraudFlag("flag-1");

    expect(getApi).toHaveBeenCalledWith("/admin/fraud/flags/flag-1");
    expect(result.success).toBe(true);
    expect(result.data.id).toBe("flag-1");
  });
});

describe("reviewFraudFlag", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates flag status and resolution note", async () => {
    const updatedFlag = { ...mockFlags[0], status: "resolved" };
    (patchApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      data: updatedFlag,
    });

    const result = await reviewFraudFlag("flag-1", "resolved", "Test note");

    expect(patchApi).toHaveBeenCalledWith("/admin/fraud/flags/flag-1", {
      status: "resolved",
      resolutionNote: "Test note",
    });
    expect(result.success).toBe(true);
    expect(result.data.status).toBe("resolved");
  });
});
