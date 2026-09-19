import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useTopPerformingTravelers,
  useTopPerformingAgencies,
} from "../hooks/use-top-performers";
import type { TopPerformingTraveler, TopPerformingAgency } from "../types";
import { cn } from "@/lib/utils";

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num: number) {
  return new Intl.NumberFormat("en-US").format(num);
}

export default function TopPerformersTable() {
  const { data: travelersData, isLoading: travelersLoading } =
    useTopPerformingTravelers();
  const { data: agenciesData, isLoading: agenciesLoading } =
    useTopPerformingAgencies(10);

  const travelers = (travelersData?.data ?? []) as TopPerformingTraveler[];
  const agencies = (agenciesData?.data ?? []) as TopPerformingAgency[];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Top Performers</h1>
        <p className="text-muted-foreground">
          Highest-performing travelers and agencies on the platform
        </p>
      </div>

      <Tabs defaultValue="travelers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="travelers">Top Travelers</TabsTrigger>
          <TabsTrigger value="agencies">Top Agencies</TabsTrigger>
        </TabsList>

        <TabsContent value="travelers" className="space-y-4">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium">
                    Rank
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium">
                    Traveler
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium">
                    Username
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium">
                    Completed Trips
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {travelersLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : travelers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No top-performing travelers found (minimum 3 completed
                      trips required)
                    </TableCell>
                  </TableRow>
                ) : (
                  travelers.map((traveler, index) => (
                    <TableRow
                      key={traveler.id}
                      className="border-t border-border hover:bg-muted/30"
                    >
                      <TableCell className="px-4 py-3 text-sm font-medium">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                            index === 0 && "bg-yellow-100 text-yellow-700",
                            index === 1 && "bg-gray-100 text-gray-700",
                            index === 2 && "bg-amber-100 text-amber-700",
                            index >= 3 && "bg-muted text-muted-foreground",
                          )}
                        >
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                traveler.photoMediaId
                                  ? "/api/storage/" + traveler.photoMediaId
                                  : undefined
                              }
                              alt={traveler.displayName}
                            />
                            <AvatarFallback>
                              {traveler.displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {traveler.displayName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                        @{traveler.username}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm">
                        <Badge
                          variant="outline"
                          className="text-lg font-medium"
                        >
                          {formatNumber(traveler.completedTripCount)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="agencies" className="space-y-4">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium">
                    Rank
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium">
                    Agency
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium">
                    Reputation
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium">
                    Total Bookings
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium">
                    Total Revenue
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium">
                    Tier
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agenciesLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : agencies.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No top-performing agencies found
                    </TableCell>
                  </TableRow>
                ) : (
                  agencies.map((agency, index) => (
                    <TableRow
                      key={agency.id}
                      className="border-t border-border hover:bg-muted/30"
                    >
                      <TableCell className="px-4 py-3 text-sm font-medium">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                            index === 0 && "bg-yellow-100 text-yellow-700",
                            index === 1 && "bg-gray-100 text-gray-700",
                            index === 2 && "bg-amber-100 text-amber-700",
                            index >= 3 && "bg-muted text-muted-foreground",
                          )}
                        >
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm font-medium">
                        {agency.agencyName}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm">
                        <Badge
                          variant={
                            agency.reputationScore !== null &&
                            agency.reputationScore >= 4.5
                              ? "default"
                              : "outline"
                          }
                        >
                          {agency.reputationScore !== null
                            ? agency.reputationScore.toFixed(1)
                            : "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm">
                        {formatNumber(agency.totalBookings)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm font-medium">
                        {formatCurrency(agency.totalRevenue)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm">
                        <Badge variant="outline" className="capitalize">
                          {agency.subscriptionTier}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
