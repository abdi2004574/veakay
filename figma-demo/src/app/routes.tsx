import { createBrowserRouter } from "react-router";
import Root from "./Root";
import AgencyRoot from "./AgencyRoot";
import SplashScreen from "./screens/SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import SelectUserScreen from "./screens/SelectUserScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SignUpEmailScreen from "./screens/SignUpEmailScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import CreateProfileScreen from "./screens/CreateProfileScreen";
import TravelPreferencesScreen from "./screens/TravelPreferencesScreen";
import PaymentSetupScreen from "./screens/PaymentSetupScreen";
import ProfileCompleteScreen from "./screens/ProfileCompleteScreen";
import LoginScreen from "./screens/LoginScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ProfileSetupScreen from "./screens/ProfileSetupScreen";
import HomeScreen from "./screens/HomeScreen";
import ExploreScreen from "./screens/ExploreScreen";
import CampaignsScreen from "./screens/CampaignsScreen";
import ChatListScreen from "./screens/ChatListScreen";
import ChatDetailScreen from "./screens/ChatDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CreateCampaignScreen from "./screens/CreateCampaignScreen";
import CampaignDetailScreen from "./screens/CampaignDetailScreen";
import ItineraryScreen from "./screens/ItineraryScreen";
import AgencyDetailScreen from "./screens/AgencyDetailScreen";
import WithdrawalScreen from "./screens/WithdrawalScreen";
import FriendsScreen from "./screens/FriendsScreen";
import GroupCampaignScreen from "./screens/GroupCampaignScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import ReviewScreen from "./screens/ReviewScreen";
import StoryScreen from "./screens/StoryScreen";
import TermsAndConditionsScreen from "./screens/TermsAndConditionsScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import UIComponentsDemo from "./screens/UIComponentsDemo";
import CreatePostScreen from "./screens/CreatePostScreen";
import ReviewAgencyScreen from "./screens/ReviewAgencyScreen";
import MyReviewsScreen from "./screens/MyReviewsScreen";
import PreviousTripsScreen from "./screens/PreviousTripsScreen";
import TripDetailScreen from "./screens/TripDetailScreen";
import WalletScreen from "./screens/WalletScreen";
import AddPreviousTripsScreen from "./screens/AddPreviousTripsScreen";

// New screens for Friends & Group Trips
import UserProfileViewScreen from "./screens/UserProfileViewScreen";
import AddFriendScreen from "./screens/AddFriendScreen";

// New Settings Screens
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import PaymentMethodsScreen from "./screens/PaymentMethodsScreen";
import PrivacySecurityScreen from "./screens/PrivacySecurityScreen";

// Agency screens
import AgencySignUpScreen from "./screens/agency/AgencySignUpScreen";
import AgencyLoginScreen from "./screens/agency/AgencyLoginScreen";
import AgencyRegistrationScreen from "./screens/agency/AgencyRegistrationScreen";
import AgencyStatusScreen from "./screens/agency/AgencyStatusScreen";
import AgencyDashboardScreen from "./screens/agency/AgencyDashboardScreen";
import AgencyPackagesScreen from "./screens/agency/AgencyPackagesScreen";
import AgencyCreatePackageScreen from "./screens/agency/AgencyCreatePackageScreen";
import AgencyRequestsScreen from "./screens/agency/AgencyRequestsScreen";
import AgencyRequestDetailScreen from "./screens/agency/AgencyRequestDetailScreen";
import AgencyChatListScreen from "./screens/agency/AgencyChatListScreen";
import AgencyProfileScreen from "./screens/agency/AgencyProfileScreen";
import AgencyRevenueScreen from "./screens/agency/AgencyRevenueScreen";
import AgencySettingsScreen from "./screens/agency/AgencySettingsScreen";
import AgencyTermsAndConditionsScreen from "./screens/agency/AgencyTermsAndConditionsScreen";
import AgencyPrivacyPolicyScreen from "./screens/agency/AgencyPrivacyPolicyScreen";
import AgencyForgotPasswordScreen from "./screens/agency/AgencyForgotPasswordScreen";
import AgencyEditProfileScreen from "./screens/agency/AgencyEditProfileScreen";
import AgencyNotificationsScreen from "./screens/agency/AgencyNotificationsScreen";
import AgencyReviewsScreen from "./screens/agency/AgencyReviewsScreen";

// New Agency Screens
import AgencyChangePasswordScreen from "./screens/agency/AgencyChangePasswordScreen";
import AgencyPrivacySecurityScreen from "./screens/agency/AgencyPrivacySecurityScreen";
import AgencyUpdateDocumentsScreen from "./screens/agency/AgencyUpdateDocumentsScreen";
import AgencySupportScreen from "./screens/agency/AgencySupportScreen";

// NotFound Component
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl mb-4">404</h1>
        <p className="text-muted-foreground mb-6">Page not found</p>
        <a
          href="/"
          className="px-6 py-3 rounded-full text-white inline-block"
          style={{ background: "var(--vaykae-gradient)" }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen />,
  },
  {
    path: "/onboarding",
    element: <OnboardingScreen />,
  },
  {
    path: "/select-user",
    element: <SelectUserScreen />,
  },
  {
    path: "/signup",
    element: <SignUpEmailScreen />,
  },
  {
    path: "/signup/otp",
    element: <OTPVerificationScreen />,
  },
  {
    path: "/signup/create-profile",
    element: <CreateProfileScreen />,
  },
  {
    path: "/signup/travel-preferences",
    element: <TravelPreferencesScreen />,
  },
  {
    path: "/signup/add-trips",
    element: <AddPreviousTripsScreen />,
  },
  {
    path: "/signup/payment-setup",
    element: <PaymentSetupScreen />,
  },
  {
    path: "/signup/complete",
    element: <ProfileCompleteScreen />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordScreen />,
  },
  {
    path: "/profile-setup",
    element: <ProfileSetupScreen />,
  },
  {
    path: "/story/:id",
    element: <StoryScreen />,
  },
  {
    path: "/terms-and-conditions",
    element: <TermsAndConditionsScreen />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicyScreen />,
  },
  {
    path: "/app",
    element: <Root />,
    children: [
      { index: true, element: <HomeScreen /> },
      { path: "home", element: <HomeScreen /> },
      { path: "explore", element: <ExploreScreen /> },
      { path: "campaigns", element: <CampaignsScreen /> },
      { path: "chat", element: <ChatListScreen /> },
      { path: "chat/:id", element: <ChatDetailScreen /> },
      { path: "profile", element: <ProfileScreen /> },
      { path: "create-campaign", element: <CreateCampaignScreen /> },
      { path: "campaign/:id", element: <CampaignDetailScreen /> },
      { path: "itinerary", element: <ItineraryScreen /> },
      { path: "agency/:id", element: <AgencyDetailScreen /> },
      { path: "withdrawal", element: <WithdrawalScreen /> },
      { path: "friends", element: <FriendsScreen /> },
      { path: "group-campaign", element: <GroupCampaignScreen /> },
      { path: "notifications", element: <NotificationsScreen /> },
      { path: "settings", element: <SettingsScreen /> },
      { path: "edit-profile", element: <EditProfileScreen /> },
      { path: "review/:agencyId", element: <ReviewScreen /> },
      { path: "create-post", element: <CreatePostScreen /> },
      { path: "review-agency/:agencyId", element: <ReviewAgencyScreen /> },
      { path: "my-reviews", element: <MyReviewsScreen /> },
      { path: "trips", element: <PreviousTripsScreen /> },
      { path: "trip/:id", element: <TripDetailScreen /> },
      { path: "wallet", element: <WalletScreen /> },
      { path: "add-trip", element: <AddPreviousTripsScreen /> },
      { path: "user/:userId", element: <UserProfileViewScreen /> },
      { path: "add-friend", element: <AddFriendScreen /> },
      { path: "withdraw", element: <WithdrawalScreen /> },
      { path: "change-password", element: <ChangePasswordScreen /> },
      { path: "payment-methods", element: <PaymentMethodsScreen /> },
      { path: "privacy-security", element: <PrivacySecurityScreen /> },
    ],
  },
  // Agency Authentication Routes (outside AgencyRoot)
  {
    path: "/agency/signup",
    element: <AgencySignUpScreen />,
  },
  {
    path: "/agency/login",
    element: <AgencyLoginScreen />,
  },
  {
    path: "/agency/registration",
    element: <AgencyRegistrationScreen />,
  },
  {
    path: "/agency/status",
    element: <AgencyStatusScreen />,
  },
  {
    path: "/agency/forgot-password",
    element: <AgencyForgotPasswordScreen />,
  },
  // Agency App Routes (with bottom navigation)
  {
    path: "/agency/app",
    element: <AgencyRoot />,
    children: [
      { index: true, element: <AgencyDashboardScreen /> },
      { path: "packages", element: <AgencyPackagesScreen /> },
      { path: "create-package", element: <AgencyCreatePackageScreen /> },
      { path: "edit-package/:id", element: <AgencyCreatePackageScreen /> },
      { path: "requests", element: <AgencyRequestsScreen /> },
      { path: "request/:id", element: <AgencyRequestDetailScreen /> },
      { path: "chat", element: <AgencyChatListScreen /> },
      { path: "chat/:id", element: <ChatDetailScreen /> },
      { path: "profile", element: <AgencyProfileScreen /> },
      { path: "edit-profile", element: <AgencyEditProfileScreen /> },
      { path: "revenue", element: <AgencyRevenueScreen /> },
      { path: "settings", element: <AgencySettingsScreen /> },
      { path: "notifications", element: <AgencyNotificationsScreen /> },
      { path: "reviews", element: <AgencyReviewsScreen /> },
      { path: "terms-and-conditions", element: <AgencyTermsAndConditionsScreen /> },
      { path: "privacy-policy", element: <AgencyPrivacyPolicyScreen /> },
      { path: "change-password", element: <AgencyChangePasswordScreen /> },
      { path: "privacy-security", element: <AgencyPrivacySecurityScreen /> },
      { path: "update-documents", element: <AgencyUpdateDocumentsScreen /> },
      { path: "support", element: <AgencySupportScreen /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);