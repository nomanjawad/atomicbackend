import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import HomePageFormPage from "./pages/HomePageFormPage"
import AboutPageFormPage from "./pages/AboutPageFormPage"
import ContactPageFormPage from "./pages/ContactPageFormPage"
import BlogPostFormPage from "./pages/BlogPostFormPage"
import CsrFormPage from "./pages/CsrFormPage"
import GalleryPageFormPage from "./pages/GalleryPageFormPage"
import IndustriesPageFormPage from "./pages/IndustriesPageFormPage"
import ServiceFormPage from "./pages/ServiceFormPage"
import IndividualServiceFormPage from "./pages/IndividualServiceFormPage"
import HomePageTablePage from "./pages/HomePageTablePage"
import AboutPageTablePage from "./pages/AboutPageTablePage"
import ContactPageTablePage from "./pages/ContactPageTablePage"
import BlogPostTablePage from "./pages/BlogPostTablePage"
import CsrTablePage from "./pages/CsrTablePage"
import GalleryPageTablePage from "./pages/GalleryPageTablePage"
import IndustriesPageTablePage from "./pages/IndustriesPageTablePage"
import ServicesPageTablePage from "./pages/ServicesPageTablePage"
import IndividualServiceTablePage from "./pages/IndividualServiceTablePage"
import HomePageOne from "./pages/HomePageOne"
import HomePageTwo from "./pages/HomePageTwo"
import RawDataPage from "./pages/RawDataPage"
import HomePageThree from "./pages/HomePageThree"
import HomePageFour from "./pages/HomePageFour"
import HomePageFive from "./pages/HomePageFive"
import HomePageSix from "./pages/HomePageSix"
import HomePageSeven from "./pages/HomePageSeven"
import EmailPage from "./pages/EmailPage"
import AddUserPage from "./pages/AddUserPage"
import AlertPage from "./pages/AlertPage"
import AssignRolePage from "./pages/AssignRolePage"
import AvatarPage from "./pages/AvatarPage"
import BadgesPage from "./pages/BadgesPage"
import ButtonPage from "./pages/ButtonPage"
import CalendarMainPage from "./pages/CalendarMainPage"
import CardPage from "./pages/CardPage"
import CarouselPage from "./pages/CarouselPage"
import ChatEmptyPage from "./pages/ChatEmptyPage"
import ChatMessagePage from "./pages/ChatMessagePage"
import ChatProfilePage from "./pages/ChatProfilePage"
import CodeGeneratorNewPage from "./pages/CodeGeneratorNewPage"
import CodeGeneratorPage from "./pages/CodeGeneratorPage"
import ColorsPage from "./pages/ColorsPage"
import ColumnChartPage from "./pages/ColumnChartPage"
import CompanyPage from "./pages/CompanyPage"
import CurrenciesPage from "./pages/CurrenciesPage"
import DropdownPage from "./pages/DropdownPage"
import ErrorPage from "./pages/ErrorPage"
import FaqPage from "./pages/FaqPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import FormLayoutPage from "./pages/FormLayoutPage"
import FormValidationPage from "./pages/FormValidationPage"
import FormPage from "./pages/FormPage"
import GalleryPage from "./pages/GalleryPage"
import ImageGeneratorPage from "./pages/ImageGeneratorPage"
import ImageUploadPage from "./pages/ImageUploadPage"
import InvoiceAddPage from "./pages/InvoiceAddPage"
import InvoiceEditPage from "./pages/InvoiceEditPage"
import InvoiceListPage from "./pages/InvoiceListPage"
import InvoicePreviewPage from "./pages/InvoicePreviewPage"
import KanbanPage from "./pages/KanbanPage"
import LanguagePage from "./pages/LanguagePage"
import LineChartPage from "./pages/LineChartPage"
import ListPage from "./pages/ListPage"
import MarketplaceDetailsPage from "./pages/MarketplaceDetailsPage"
import MarketplacePage from "./pages/MarketplacePage"
import NotificationAlertPage from "./pages/NotificationAlertPage"
import NotificationPage from "./pages/NotificationPage"
import PaginationPage from "./pages/PaginationPage"
import PaymentGatewayPage from "./pages/PaymentGatewayPage"
import PieChartPage from "./pages/PieChartPage"
import PortfolioPage from "./pages/PortfolioPage"
import PricingPage from "./pages/PricingPage"
import ProgressPage from "./pages/ProgressPage"
import RadioPage from "./pages/RadioPage"
import RoleAccessPage from "./pages/RoleAccessPage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import StarRatingPage from "./pages/StarRatingPage"
import StarredPage from "./pages/StarredPage"
import SwitchPage from "./pages/SwitchPage"
import TableBasicPage from "./pages/TableBasicPage"
import TableDataPage from "./pages/TableDataPage"
import TabsPage from "./pages/TabsPage"
import TagsPage from "./pages/TagsPage"
import TermsConditionPage from "./pages/TermsConditionPage"
import TextGeneratorPage from "./pages/TextGeneratorPage"
import ThemePage from "./pages/ThemePage"
import TooltipPage from "./pages/TooltipPage"
import TypographyPage from "./pages/TypographyPage"
import UsersGridPage from "./pages/UsersGridPage"
import UsersListPage from "./pages/UsersListPage"
import ViewDetailsPage from "./pages/ViewDetailsPage"
import VideoGeneratorPage from "./pages/VideoGeneratorPage"
import VideosPage from "./pages/VideosPage"
import ViewProfilePage from "./pages/ViewProfilePage"
import VoiceGeneratorPage from "./pages/VoiceGeneratorPage"
import WalletPage from "./pages/WalletPage"
import WidgetsPage from "./pages/WidgetsPage"
import WizardPage from "./pages/WizardPage"
import RouteScrollToTop from "./helper/RouteScrollToTop"
import TextGeneratorNewPage from "./pages/TextGeneratorNewPage"
import HomePageEight from "./pages/HomePageEight"
import HomePageNine from "./pages/HomePageNine"
import HomePageTen from "./pages/HomePageTen"
import HomePageEleven from "./pages/HomePageEleven"
import GalleryGridPage from "./pages/GalleryGridPage"
import GalleryMasonryPage from "./pages/GalleryMasonryPage"
import GalleryHoverPage from "./pages/GalleryHoverPage"
import BlogPage from "./pages/BlogPage"
import BlogDetailsPage from "./pages/BlogDetailsPage"
import AddBlogPage from "./pages/AddBlogPage"
import TestimonialsPage from "./pages/TestimonialsPage"
import ComingSoonPage from "./pages/ComingSoonPage"
import AccessDeniedPage from "./pages/AccessDeniedPage"
import MaintenancePage from "./pages/MaintenancePage"
import BlankPagePage from "./pages/BlankPagePage"
import SeoScriptsFormPage from "./pages/SeoScriptsFormPage"
import SeoScriptsTablePage from "./pages/SeoScriptsTablePage"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteScrollToTop />
        <Routes>
          {/* Public Auth Routes - No protection */}
          <Route exact path="/sign-in" element={<SignInPage />} />
          <Route exact path="/sign-up" element={<SignUpPage />} />
          <Route exact path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Error/Info Pages - Public */}
          <Route exact path="/coming-soon" element={<ComingSoonPage />} />
          <Route exact path="/access-denied" element={<AccessDeniedPage />} />
          <Route exact path="/maintenance" element={<MaintenancePage />} />
          <Route exact path="*" element={<ErrorPage />} />

          {/* Protected Dashboard Routes - Require Login */}
          <Route exact path="/" element={<ProtectedRoute><HomePageTwo /></ProtectedRoute>} />
          <Route exact path="/index-2" element={<ProtectedRoute><HomePageTwo /></ProtectedRoute>} />
          <Route exact path="/raw-data" element={<ProtectedRoute requiredRole="admin"><RawDataPage /></ProtectedRoute>} />
          <Route exact path="/index-9" element={<ProtectedRoute><HomePageNine /></ProtectedRoute>} />

          {/* Protected User Management - Admin Only */}
          <Route exact path="/add-user" element={<ProtectedRoute allowedRoles={['admin']}><AddUserPage /></ProtectedRoute>} />
          <Route exact path="/users-grid" element={<ProtectedRoute allowedRoles={['admin']}><UsersGridPage /></ProtectedRoute>} />
          <Route exact path="/users-list" element={<ProtectedRoute allowedRoles={['admin']}><UsersListPage /></ProtectedRoute>} />
          <Route exact path="/view-profile" element={<ProtectedRoute><ViewProfilePage /></ProtectedRoute>} />
          <Route exact path="/assign-role" element={<ProtectedRoute allowedRoles={['admin']}><AssignRolePage /></ProtectedRoute>} />
          <Route exact path="/role-access" element={<ProtectedRoute allowedRoles={['admin']}><RoleAccessPage /></ProtectedRoute>} />

          {/* Protected Page Forms - Admin and Moderator Only */}
          <Route exact path="/home-page-form" element={<ProtectedRoute allowedRoles={['admin', 'moderator']}><HomePageFormPage /></ProtectedRoute>} />
          <Route exact path="/about-page-form" element={<ProtectedRoute allowedRoles={['admin', 'moderator']}><AboutPageFormPage /></ProtectedRoute>} />
          <Route exact path="/contact-page-form" element={<ProtectedRoute allowedRoles={['admin', 'moderator']}><ContactPageFormPage /></ProtectedRoute>} />
          <Route exact path="/blog-post-form" element={<ProtectedRoute allowedRoles={['admin', 'moderator']}><BlogPostFormPage /></ProtectedRoute>} />
          <Route exact path="/csr-form" element={<ProtectedRoute allowedRoles={['admin', 'moderator']}><CsrFormPage /></ProtectedRoute>} />
          <Route exact path="/gallery-page-form" element={<ProtectedRoute allowedRoles={['admin', 'moderator']}><GalleryPageFormPage /></ProtectedRoute>} />
          <Route exact path="/industries-page-form" element={<ProtectedRoute allowedRoles={['admin', 'moderator']}><IndustriesPageFormPage /></ProtectedRoute>} />
          <Route exact path="/service-form" element={<ProtectedRoute allowedRoles={['admin', 'moderator']}><ServiceFormPage /></ProtectedRoute>} />
          <Route exact path="/individual-service-form" element={<ProtectedRoute allowedRoles={['admin', 'moderator']}><IndividualServiceFormPage /></ProtectedRoute>} />
          <Route exact path="/seo-scripts-form" element={<ProtectedRoute allowedRoles={['admin', 'moderator']}><SeoScriptsFormPage /></ProtectedRoute>} />

          {/* Protected Page Tables - All Authenticated Users */}
          <Route exact path="/home-page-table" element={<ProtectedRoute><HomePageTablePage /></ProtectedRoute>} />
          <Route exact path="/about-page-table" element={<ProtectedRoute><AboutPageTablePage /></ProtectedRoute>} />
          <Route exact path="/contact-page-table" element={<ProtectedRoute><ContactPageTablePage /></ProtectedRoute>} />
          <Route exact path="/blog-post-table" element={<ProtectedRoute><BlogPostTablePage /></ProtectedRoute>} />
          <Route exact path="/csr-table" element={<ProtectedRoute><CsrTablePage /></ProtectedRoute>} />
          <Route exact path="/gallery-page-table" element={<ProtectedRoute><GalleryPageTablePage /></ProtectedRoute>} />
          <Route exact path="/industries-page-table" element={<ProtectedRoute><IndustriesPageTablePage /></ProtectedRoute>} />
          <Route exact path="/services-page-table" element={<ProtectedRoute><ServicesPageTablePage /></ProtectedRoute>} />
          <Route exact path="/individual-service-table" element={<ProtectedRoute><IndividualServiceTablePage /></ProtectedRoute>} />
          <Route exact path="/seo-scripts-table" element={<ProtectedRoute allowedRoles={['admin', 'moderator']}><SeoScriptsTablePage /></ProtectedRoute>} />

          {/* Protected General Dashboard Pages */}
          <Route exact path="/alert" element={<ProtectedRoute><AlertPage /></ProtectedRoute>} />
          <Route exact path="/avatar" element={<ProtectedRoute><AvatarPage /></ProtectedRoute>} />
          <Route exact path="/badges" element={<ProtectedRoute><BadgesPage /></ProtectedRoute>} />
          <Route exact path="/button" element={<ProtectedRoute><ButtonPage /></ProtectedRoute>} />
          <Route exact path="/calendar-main" element={<ProtectedRoute><CalendarMainPage /></ProtectedRoute>} />
          <Route exact path="/calendar" element={<ProtectedRoute><CalendarMainPage /></ProtectedRoute>} />
          <Route exact path="/card" element={<ProtectedRoute><CardPage /></ProtectedRoute>} />
          <Route exact path="/carousel" element={<ProtectedRoute><CarouselPage /></ProtectedRoute>} />
          <Route exact path="/chat-empty" element={<ProtectedRoute><ChatEmptyPage /></ProtectedRoute>} />
          <Route exact path="/chat-message" element={<ProtectedRoute><ChatMessagePage /></ProtectedRoute>} />
          <Route exact path="/chat-profile" element={<ProtectedRoute><ChatProfilePage /></ProtectedRoute>} />
          <Route exact path="/code-generator" element={<ProtectedRoute><CodeGeneratorPage /></ProtectedRoute>} />
          <Route exact path="/code-generator-new" element={<ProtectedRoute><CodeGeneratorNewPage /></ProtectedRoute>} />
          <Route exact path="/colors" element={<ProtectedRoute><ColorsPage /></ProtectedRoute>} />
          <Route exact path="/column-chart" element={<ProtectedRoute><ColumnChartPage /></ProtectedRoute>} />
          <Route exact path="/company" element={<ProtectedRoute><CompanyPage /></ProtectedRoute>} />
          <Route exact path="/currencies" element={<ProtectedRoute><CurrenciesPage /></ProtectedRoute>} />
          <Route exact path="/dropdown" element={<ProtectedRoute><DropdownPage /></ProtectedRoute>} />
          <Route exact path="/email" element={<ProtectedRoute><EmailPage /></ProtectedRoute>} />
          <Route exact path="/faq" element={<ProtectedRoute><FaqPage /></ProtectedRoute>} />
          <Route exact path="/form-layout" element={<ProtectedRoute><FormLayoutPage /></ProtectedRoute>} />
          <Route exact path="/form-validation" element={<ProtectedRoute><FormValidationPage /></ProtectedRoute>} />
          <Route exact path="/form" element={<ProtectedRoute><FormPage /></ProtectedRoute>} />
          <Route exact path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
          <Route exact path="/gallery-grid" element={<ProtectedRoute><GalleryGridPage /></ProtectedRoute>} />
          <Route exact path="/gallery-masonry" element={<ProtectedRoute><GalleryMasonryPage /></ProtectedRoute>} />
          <Route exact path="/gallery-hover" element={<ProtectedRoute><GalleryHoverPage /></ProtectedRoute>} />
          <Route exact path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
          <Route exact path="/blog-details" element={<ProtectedRoute><BlogDetailsPage /></ProtectedRoute>} />
          <Route exact path="/add-blog" element={<ProtectedRoute><AddBlogPage /></ProtectedRoute>} />
          <Route exact path="/testimonials" element={<ProtectedRoute><TestimonialsPage /></ProtectedRoute>} />
          <Route exact path="/blank-page" element={<ProtectedRoute><BlankPagePage /></ProtectedRoute>} />
          <Route exact path="/image-generator" element={<ProtectedRoute><ImageGeneratorPage /></ProtectedRoute>} />
          <Route exact path="/image-upload" element={<ProtectedRoute><ImageUploadPage /></ProtectedRoute>} />
          <Route exact path="/invoice-add" element={<ProtectedRoute><InvoiceAddPage /></ProtectedRoute>} />
          <Route exact path="/invoice-edit" element={<ProtectedRoute><InvoiceEditPage /></ProtectedRoute>} />
          <Route exact path="/invoice-list" element={<ProtectedRoute><InvoiceListPage /></ProtectedRoute>} />
          <Route exact path="/invoice-preview" element={<ProtectedRoute><InvoicePreviewPage /></ProtectedRoute>} />
          <Route exact path="/kanban" element={<ProtectedRoute><KanbanPage /></ProtectedRoute>} />
          <Route exact path="/language" element={<ProtectedRoute><LanguagePage /></ProtectedRoute>} />
          <Route exact path="/line-chart" element={<ProtectedRoute><LineChartPage /></ProtectedRoute>} />
          <Route exact path="/list" element={<ProtectedRoute><ListPage /></ProtectedRoute>} />
          <Route exact path="/marketplace-details" element={<ProtectedRoute><MarketplaceDetailsPage /></ProtectedRoute>} />
          <Route exact path="/marketplace" element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
          <Route exact path="/notification-alert" element={<ProtectedRoute><NotificationAlertPage /></ProtectedRoute>} />
          <Route exact path="/notification" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
          <Route exact path="/pagination" element={<ProtectedRoute><PaginationPage /></ProtectedRoute>} />
          <Route exact path="/payment-gateway" element={<ProtectedRoute><PaymentGatewayPage /></ProtectedRoute>} />
          <Route exact path="/pie-chart" element={<ProtectedRoute><PieChartPage /></ProtectedRoute>} />
          <Route exact path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
          <Route exact path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
          <Route exact path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route exact path="/radio" element={<ProtectedRoute><RadioPage /></ProtectedRoute>} />
          <Route exact path="/star-rating" element={<ProtectedRoute><StarRatingPage /></ProtectedRoute>} />
          <Route exact path="/starred" element={<ProtectedRoute><StarredPage /></ProtectedRoute>} />
          <Route exact path="/switch" element={<ProtectedRoute><SwitchPage /></ProtectedRoute>} />
          <Route exact path="/table-basic" element={<ProtectedRoute><TableBasicPage /></ProtectedRoute>} />
          <Route exact path="/table-data" element={<ProtectedRoute><TableDataPage /></ProtectedRoute>} />
          <Route exact path="/tabs" element={<ProtectedRoute><TabsPage /></ProtectedRoute>} />
          <Route exact path="/tags" element={<ProtectedRoute><TagsPage /></ProtectedRoute>} />
          <Route exact path="/terms-condition" element={<ProtectedRoute><TermsConditionPage /></ProtectedRoute>} />
          <Route exact path="/text-generator-new" element={<ProtectedRoute><TextGeneratorNewPage /></ProtectedRoute>} />
          <Route exact path="/text-generator" element={<ProtectedRoute><TextGeneratorPage /></ProtectedRoute>} />
          <Route exact path="/theme" element={<ProtectedRoute><ThemePage /></ProtectedRoute>} />
          <Route exact path="/tooltip" element={<ProtectedRoute><TooltipPage /></ProtectedRoute>} />
          <Route exact path="/typography" element={<ProtectedRoute><TypographyPage /></ProtectedRoute>} />
          <Route exact path="/view-details" element={<ProtectedRoute><ViewDetailsPage /></ProtectedRoute>} />
          <Route exact path="/video-generator" element={<ProtectedRoute><VideoGeneratorPage /></ProtectedRoute>} />
          <Route exact path="/videos" element={<ProtectedRoute><VideosPage /></ProtectedRoute>} />
          <Route exact path="/voice-generator" element={<ProtectedRoute><VoiceGeneratorPage /></ProtectedRoute>} />
          <Route exact path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
          <Route exact path="/widgets" element={<ProtectedRoute><WidgetsPage /></ProtectedRoute>} />
          <Route exact path="/wizard" element={<ProtectedRoute><WizardPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
