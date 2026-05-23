import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../store/authStore";
import { response } from "../services/mockApi";
import { formatCurrency, formatDate, formatTime } from "../utils/dateFormatter";

interface ApiTransaction {
  refId: string;
  transferDate: string;
  recipientName: string;
  transferName: string;
  amount: number;
}

export default function DashboardScreen() {
  const { logout } = useAuthStore();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [userName, setUserName] = useState("User");
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const transactions: ApiTransaction[] = response.data;

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const activeEmail = await AsyncStorage.getItem("current_user_email");
        const usersJSON = await AsyncStorage.getItem("users_list");

        if (activeEmail && usersJSON) {
          const usersArray = JSON.parse(usersJSON);
          const currentProfile = usersArray.find((u: any) => u.email === activeEmail);
          
          if (currentProfile && currentProfile.name) {
            setUserName(currentProfile.name);
          }
        }
      } catch (error) {
        console.error("Error reading profile data", error);
      }
    };

    fetchCurrentProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "false");
      await AsyncStorage.removeItem("current_user_email");
      logout();
    } catch (error) {
      Alert.alert("System Error", "Failed to sign out securely.");
    }
  };

  const renderTransactionItem = ({ item }: { item: ApiTransaction }) => {
    const isCredit = item.amount > 0;

    return (
      <TouchableOpacity 
        style={styles.transactionItemRow}
        activeOpacity={0.7}
        onPress={() => {
          try {
            navigation.navigate("TransactionDetail", { 
              transaction: item 
            });
          } catch (e) {
            Alert.alert("Navigation Alert", `Viewing fallback payload for ref: ${item.refId}`);
          }
        }}
      >
        <View style={styles.txLeftDetails}>
          <View style={[
            styles.txAvatarContainer,
            { backgroundColor: isCredit ? "#E8F5E9" : "#F3F4F6" }
          ]}>
            <Text style={[styles.txAvatarIcon, { color: isCredit ? "#2E7D32" : "#d42f2f" }]}>
              {isCredit ? "📥" : "📤"}
            </Text>
          </View>
          <View style={styles.txMetaTextColumn}>
            <Text style={styles.txTitleText} numberOfLines={1}>
              {item.recipientName}
            </Text>
            <Text style={styles.txDateText}>
              {item.transferName}
            </Text>
            <Text style={styles.txDateText}>
              {formatDate(item.transferDate)} • {formatTime(item.transferDate)}
            </Text>
          </View>
        </View>
        
        <View style={styles.txRightColumn}>
          <Text style={[
            styles.txAmountText,
            { color: isCredit ? "#16A34A" : "#d42f2f" }
          ]}>
            {formatCurrency(item.amount)}
          </Text>
          <Text style={styles.chevronIndicator}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const DashboardHeader = () => (
    <View style={styles.headerComponentInner}>
      {/* Financial Account Card block */}
      <View style={styles.balanceCard}>
        <View style={styles.accountTypeRow}>
          <Text style={styles.accountTypeText}>Savings Account-i</Text>
          <Text style={styles.shariahTag}>Shariah Compliant</Text>
        </View>
        
        <View style={styles.balanceLabelRow}>
          <Text style={styles.balanceCurrencyLabel}>Available Balance</Text>
          <TouchableOpacity 
            style={styles.visibilityToggleBtn}
            onPress={() => setShowBalance(!showBalance)}
            activeOpacity={0.6}
          >
            <Text style={styles.visibilityIconText}>
              {showBalance ? "👁️" : "👁️‍🗨️"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.balanceAmountText}>
          {showBalance ? "RM 12,450.80" : "************"}
        </Text>

        <View style={styles.accountNumberRow}>
          <Text style={styles.accountNumberText}>{showBalance ? "AEON 4278 1855 9012" : "AEON **** 9012"}</Text>
        </View>
      </View>

      <Text style={styles.sectionHeading}>Quick Access</Text>

      <View style={styles.featuresGrid}>
        <TouchableOpacity style={styles.gridItem}>
          <View style={[styles.iconPlaceholder, { backgroundColor: "#FCE7F3" }]}>
            <Text style={[styles.gridIconText, { color: "#B72773" }]}>⇄</Text>
          </View>
          <Text style={styles.gridItemLabel}>Transfer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <View style={[styles.iconPlaceholder, { backgroundColor: "#E0F2FE" }]}>
            <Text style={[styles.gridIconText, { color: "#0284C7" }]}>📱</Text>
          </View>
          <Text style={styles.gridItemLabel}>Pay Bills</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <View style={[styles.iconPlaceholder, { backgroundColor: "#FEF3C7" }]}>
            <Text style={[styles.gridIconText, { color: "#D97706" }]}>▼</Text>
          </View>
          <Text style={styles.gridItemLabel}>JomPAY</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <View style={[styles.iconPlaceholder, { backgroundColor: "#DCFCE7" }]}>
            <Text style={[styles.gridIconText, { color: "#16A34A" }]}>📋</Text>
          </View>
          <Text style={styles.gridItemLabel}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionHeaderRow}>
        <Text style={styles.sectionHeadingNav}>Recent Transactions</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#B72773" />
      
      <View style={[styles.brandHeader, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcomeGreeting}>Hello,</Text>
            <Text style={styles.profileName}>{userName}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.refId}
        ListHeaderComponent={DashboardHeader}
        contentContainerStyle={[
          styles.listScrollLayout,
          { paddingBottom: Math.max(insets.bottom, 24), marginTop: 10 }
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    backgroundColor: "#F9FAFC",
  },
  brandHeader: {
    backgroundColor: "#B72773",
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  welcomeGreeting: {
    color: "#FCE7F3",
    fontSize: 14,
    fontWeight: "500",
  },
  profileName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  listScrollLayout: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerComponentInner: {
    width: "100%",
  },
  balanceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: -20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#2C313B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  accountTypeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  accountTypeText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "600",
  },
  shariahTag: {
    fontSize: 11,
    color: "#16A34A",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: "700",
    overflow: "hidden",
  },
  balanceLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceCurrencyLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  visibilityToggleBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  visibilityIconText: {
    fontSize: 16,
    color: "#6B7280",
  },
  balanceAmountText: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 4,
    letterSpacing: -0.5,
    minHeight: 40,
  },
  accountNumberRow: {
    marginTop: 14,
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
    paddingTop: 12,
  },
  accountNumberText: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500",
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C313B",
    marginTop: 28,
    marginBottom: 16,
  },
  transactionHeaderRow: {
    marginTop: 28,
    marginBottom: 12,
  },
  sectionHeadingNav: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C313B",
  },
  featuresGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  gridItem: {
    backgroundColor: "#FFFFFF",
    width: "22%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  iconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  gridIconText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  gridItemLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4B5563",
    textAlign: "center",
  },
  transactionItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  txLeftDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 12,
  },
  txAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  txAvatarIcon: {
    fontSize: 16,
  },
  txMetaTextColumn: {
    flex: 1,
  },
  txTitleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  txDateText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  txRightColumn: {
    flexDirection: "row",
    alignItems: "center",
  },
  txAmountText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
  },
  chevronIndicator: {
    fontSize: 18,
    color: "#9CA3AF",
    marginLeft: 8,
    fontWeight: "600",
    includeFontPadding: false,
  },
});