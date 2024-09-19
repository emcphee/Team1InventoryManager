namespace WarehouseInventoryManager.Utils;
using System.Linq.Expressions;
using System.Security.Cryptography;

internal class CryptoUtils
{
    public static (byte[] salt, byte[] hash) HashPassword(string password)
    {
        // 128 bit salt
        byte[] salt = RandomNumberGenerator.GetBytes(16);
        byte[] passwordBytes = System.Text.Encoding.UTF8.GetBytes(password);

        byte[] saltedPassword = new byte[salt.Length + passwordBytes.Length];
        Buffer.BlockCopy(passwordBytes, 0, saltedPassword, 0, passwordBytes.Length);
        Buffer.BlockCopy(salt, 0, saltedPassword, passwordBytes.Length, salt.Length);

        byte[] hash = SHA256.HashData(saltedPassword);
        return (salt, hash);
    }

    public static bool CheckPassword(string inputPassword, byte[] salt, byte[] trueHash)
    {

        byte[] inputPasswordBytes = System.Text.Encoding.UTF8.GetBytes(inputPassword);

        byte[] saltedPassword = new byte[salt.Length + inputPasswordBytes.Length];
        Buffer.BlockCopy(inputPasswordBytes, 0, saltedPassword, 0, inputPasswordBytes.Length);
        Buffer.BlockCopy(salt, 0, saltedPassword, inputPasswordBytes.Length, salt.Length);

        byte[] hash = SHA256.HashData(saltedPassword);
        return hash.SequenceEqual(trueHash);
    }
}
