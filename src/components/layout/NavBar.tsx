import { Typography, Row, Col, Menu, Dropdown, Drawer, Modal, Badge, Button, Grid } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  GlobalOutlined,
  MenuOutlined,
  SearchOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";

import ProductSearch from "@/components/ProductSearch";
import { useResponsive, useBoolean } from "ahooks";
import AuthTabs from "@/components/AuthTabs";
import GuestForm from "@/components/forms/GuestForm";
import VSpacing from "@/components/VSpacing";
import config from "@/config";
import { Link } from "rakkasjs";
import { useTranslation } from "react-i18next";

interface Props {
  authenticated: boolean;
  localCheckout: any | null;
  authModalOpen: boolean;
  guestCartModalOpen: boolean;
}

const NavBar: React.FC<Props> = ({ authenticated, localCheckout, authModalOpen, guestCartModalOpen }) => {
  const { t } = useTranslation();
  const [searchDrawerOpen, { setTrue: openSearchDrawer, setFalse: closeSearchDrawer }] = useBoolean(false);
  const [pwdResetModalOpen, { setTrue: openPwdResetModal, setFalse: closePwdResetModal }] = useBoolean(false);
  const [menuDrawerOpen, { setTrue: openMenuDrawer, setFalse: closeMenuDrawer }] = useBoolean(false);
  const responsive = Grid.useBreakpoint();

  const dispatch = (blah: any) => blah;
  // useEffect(() => {
  //   dispatch?.({ type: "cart/create" });
  // }, []);

  // const [fetchCartBadge, { data: cartData }] = useLazyQuery<cartBadgeQuery>(CART_BADGE_QUERY);

  // useEffect(() => {
  //   if (authenticated) {
  //     fetchCartBadge();
  //   }
  // }, [window.location.pathname, authenticated]);

  // const checkout = authenticated ? cartData?.me?.checkout : localCheckout;
  const checkout = localCheckout;

  const logout = () => dispatch?.({ type: "auth/logout" });
  const closeAuthModal = () => dispatch?.({ type: "auth/setAuthModalOpen", payload: { open: false } });
  const openAuthModal = () => dispatch?.({ type: "auth/setAuthModalOpen", payload: { open: true } });
  const closeGuestCartModal = () =>
    dispatch?.({
      type: "cart/setGuestCartModalOpen",
      payload: { open: false },
    });

  const langMenu = (
    <Menu
      onClick={(item) => {
        // setLocale(item.key, false);
        // window.location.reload();
      }}
    >
      <Menu.Item key="en-US">English</Menu.Item>
      <Menu.Item key="fr-FR">Français</Menu.Item>
    </Menu>
  );
  const avatarMenu = (
    <Menu>
      <Menu.Item>
        <Link href="/profile">{t("navbar.profile")}</Link>
      </Menu.Item>
      <Menu.Item>
        <Link href="/orders">{t("navbar.orders")}</Link>
      </Menu.Item>
      <Menu.Item>
        <Link href="/settings">{t("navbar.settings")}</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={logout}>{t("navbar.logout")}</Menu.Item>
    </Menu>
  );

  const authIcon = authenticated ? (
    <Menu.Item key="profile" className="p-0 h-full align-top" hidden={!responsive.sm}>
      <Dropdown overlay={avatarMenu} placement="bottomCenter" trigger={["click", "hover"]}>
        <div className="px-5">
          <UserOutlined className="mr-0 text-2xl" />
        </div>
      </Dropdown>
    </Menu.Item>
  ) : (
    <Menu.Item key="profile" className="h-full align-top" hidden={!responsive.sm} onClick={openAuthModal}>
      <UserOutlined className="mr-0 text-2xl" />
    </Menu.Item>
  );
  return (
    <>
      <Modal footer={null} onCancel={closeAuthModal} title={null} open={authModalOpen}>
        {/* <AuthTabs
          loginFormId="nav-login-form"
          signupFormId="nav-signup-form"
          onAuth={closeAuthModal}
          onForgotPwd={() => {
            closeAuthModal();
            openPwdResetModal();
          }}
        /> */}
      </Modal>
      <Modal
        destroyOnClose
        footer={null}
        onCancel={closePwdResetModal}
        title={t("who.resetPwd")}
        open={pwdResetModalOpen}
      >
        {/* <ResetPasswordRequestForm onSubmit={closePwdResetModal} /> */}
      </Modal>
      <Modal footer={null} onCancel={closeGuestCartModal} title={null} open={guestCartModalOpen}>
        <Typography.Title level={4} className="text-center">
          {t("navbar.loginAsk")}
        </Typography.Title>
        <VSpacing height={24} />
        <div className="text-center">
          <Button
            shape="round"
            type="primary"
            size="large"
            onClick={() => {
              closeGuestCartModal();
              openAuthModal();
            }}
          >
            {t("who.loginOrSignup")}
          </Button>
        </div>
        <VSpacing height={24} />
        <Typography.Title level={4} className="text-center">
          {t("navbar.continueAsGuest")}
        </Typography.Title>
        <div className="text-center">
          <GuestForm />
        </div>
      </Modal>
      <Drawer
        open={searchDrawerOpen}
        onClose={closeSearchDrawer}
        destroyOnClose
        placement="top"
        height={64}
        bodyStyle={{ padding: 0 }}
        closable={false}
      >
        <Row justify="center" align="middle" className="h-full">
          <Col span={16} xs={22} md={20} lg={16}>
            <ProductSearch onSearch={closeSearchDrawer} />
          </Col>
        </Row>
      </Drawer>
      <Drawer
        title={t("navbar.menu")}
        open={menuDrawerOpen}
        onClose={closeMenuDrawer}
        placement="right"
        width="60%"
        bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}
      >
        <Menu mode="inline" defaultOpenKeys={["accmenu"]} selectable={false}>
          <Menu.Item onClick={closeMenuDrawer}>
            <Link href="/cart">
              <Badge count={checkout?.lines?.length} offset={[12, 0]}>
                <ShoppingCartOutlined /> {t("navbar.cart")}
              </Badge>
            </Link>
          </Menu.Item>
          {authenticated && (
            <Menu.SubMenu
              key="accmenu"
              title={
                <span>
                  <UserOutlined />
                  <span>{t("navbar.account")}</span>
                </span>
              }
            >
              <Menu.Item onClick={closeMenuDrawer}>
                <Link href="/profile">{t("navbar.profile")}</Link>
              </Menu.Item>
              <Menu.Item onClick={closeMenuDrawer}>
                <Link href="/orders">{t("navbar.orders")}</Link>
              </Menu.Item>
              <Menu.Item onClick={closeMenuDrawer}>
                <Link href="/settings">{t("navbar.settings")}</Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
          <Menu.Divider />
          <Menu.SubMenu
            key="langmenu"
            title={
              <span>
                <GlobalOutlined />
                <span>{t("navbar.language")}</span>
              </span>
            }
          >
            <Menu.Item>English</Menu.Item>
            <Menu.Item>Français</Menu.Item>
          </Menu.SubMenu>
          <Menu.Divider />
          {authenticated && (
            <Menu.Item
              onClick={() => {
                logout();
                closeMenuDrawer();
              }}
            >
              <LogoutOutlined /> {t("navbar.logout")}
            </Menu.Item>
          )}
          {!authenticated && (
            <Menu.Item
              onClick={() => {
                openAuthModal();
                closeMenuDrawer();
              }}
            >
              <LoginOutlined /> {t("who.heading")}
            </Menu.Item>
          )}
        </Menu>
      </Drawer>
      <Row justify="space-between" align="middle" className="h-full">
        <Col className="h-full">
          <Menu mode="horizontal" className="bg-transparent border-none h-full" selectable={false}>
            <Menu.Item key="1" className="h-full block">
              <Link href="/" className="h-full">
                <Row align="middle" className="h-full">
                  <Col>
                    <Typography.Title level={3} className="m-0">
                      {t("site.title")}
                    </Typography.Title>
                  </Col>
                </Row>
              </Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col xs={0} lg={8} style={{ lineHeight: "normal" }}>
          {config.altConfig.showSearch && <ProductSearch />}
        </Col>
        <Col className="h-full">
          <Menu mode="horizontal" className="bg-transparent border-none h-full" selectable={false}>
            {config.altConfig.showSearch && (
              <Menu.Item key="search" className="h-full align-top" hidden={responsive.lg} onClick={openSearchDrawer}>
                <SearchOutlined className="mr-0 text-2xl" />
              </Menu.Item>
            )}
            <Menu.Item key="lang" className="p-0 h-full align-top" hidden={!responsive.sm}>
              <Dropdown overlay={langMenu} trigger={["click", "hover"]}>
                <div className="px-5">
                  <GlobalOutlined className="mr-0 text-2xl" />
                </div>
              </Dropdown>
            </Menu.Item>
            <Menu.Item key="cart" className="h-full align-top" hidden={!responsive.sm}>
              <Link href="/cart">
                <Badge count={checkout?.lines?.length}>
                  <ShoppingCartOutlined className="mr-0 text-2xl" />
                </Badge>
              </Link>
            </Menu.Item>
            {authIcon}
            <Menu.Item key="extra" className="h-full align-top" hidden={responsive.sm} onClick={openMenuDrawer}>
              <MenuOutlined className="mr-0 text-2xl" />
            </Menu.Item>
          </Menu>
        </Col>
      </Row>
    </>
  );
};

export default NavBar;
