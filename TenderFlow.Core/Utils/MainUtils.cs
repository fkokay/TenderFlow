using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Core.Utils
{
    public static class MainUtils
    {
        public static string NextKeyCode(string keyCode)
        {
            byte[] ASCIIValues = Encoding.UTF8.GetBytes(keyCode.ToUpper());
            int StringLength = ASCIIValues.Length;
            bool isAllZed = true;
            bool isAllNine = true;

            for (int i = 0; i < StringLength - 1; i++)
            {
                if (ASCIIValues[i] != 90)
                {
                    isAllZed = false;
                    break;
                }
            }
            if (isAllZed && ASCIIValues[StringLength - 1] == 57)
            {
                ASCIIValues[StringLength - 1] = 64;
            }

            for (int i = 0; i < StringLength; i++)
            {
                if (ASCIIValues[i] != 57)
                {
                    isAllNine = false;
                    break;
                }
            }
            if (isAllNine)
            {
                ASCIIValues[StringLength - 1] = 47;
                ASCIIValues[0] = 65;
                for (int i = 1; i < StringLength - 1; i++)
                {
                    ASCIIValues[i] = 48;
                }
            }

            for (int i = StringLength; i > 0; i--)
            {
                if (i - StringLength == 0)
                {
                    ASCIIValues[i - 1] += 1;
                }
                if (ASCIIValues[i - 1] == 58)
                {
                    ASCIIValues[i - 1] = 48;
                    if (i - 2 == -1)
                    {
                        break;
                    }
                    ASCIIValues[i - 2] += 1;
                }
                else if (ASCIIValues[i - 1] == 91)
                {
                    ASCIIValues[i - 1] = 65;
                    if (i - 2 == -1)
                    {
                        break;
                    }
                    ASCIIValues[i - 2] += 1;

                }
                else
                {
                    break;
                }

            }
            keyCode = System.Text.Encoding.UTF8.GetString(ASCIIValues);
            return keyCode;
        }
    }
}
