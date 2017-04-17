﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using VariousClassifiedWeb.Models;

namespace VariousClassifiedWeb.Controllers
{
    public class ApiController : Controller
    {
        private VariousClassifiedDBEntities db = new VariousClassifiedDBEntities();

        // GET: Api
        public JsonResult Index(int? id, string ClassifiedTitle)
      {
            if (id == null)
            {
                db.Configuration.ProxyCreationEnabled = false;
                return Json(db.Classifieds.OrderByDescending(e => e.ClassifiedID).ToList(), JsonRequestBehavior.AllowGet);
            }
            else
            {
                db.Configuration.ProxyCreationEnabled = false;
                return Json(db.Classifieds.Where(e=>e.ClassifiedID==id).OrderByDescending(e => e.ClassifiedID).ToList(), JsonRequestBehavior.AllowGet);
            }
           
        }

        // GET: Api
        public JsonResult ClassifiedsByCategoryID(int? id)
        {
            if (id == null)
            {
                db.Configuration.ProxyCreationEnabled = false;
                return Json(db.Classifieds.Select(x => new { x.ClassifiedID,x.CategoryID, x.ClassfiedImage, x.Category.CategoryTitle, x.Category.CategoryDescription, x.Category.CategoryImage,x.ClassifiedDescription,x.ClassifiedTitle, x.RefNo }).OrderByDescending(e => e.ClassifiedID).ToList(), JsonRequestBehavior.AllowGet);
            }
            else
            {
                db.Configuration.ProxyCreationEnabled = false;
                return Json(db.Classifieds.Where(e => e.CategoryID == id).Select(x => new { x.ClassifiedID, x.CategoryID, x.ClassfiedImage, x.Category.CategoryTitle, x.Category.CategoryDescription, x.Category.CategoryImage, x.ClassifiedDescription, x.ClassifiedTitle, x.RefNo }).OrderByDescending(e => e.ClassifiedID).ToList(), JsonRequestBehavior.AllowGet);
            }

        }

        // GET: Api
        public JsonResult AllClassifiedsGroupByCategoryID()
        {        
            db.Configuration.ProxyCreationEnabled = false;
            var categories = db.Categories.ToList();
            var classifieds= db.Classifieds.Select(x => new { x.ClassifiedID, x.CategoryID, x.Category.CategoryTitle, x.Category.CategoryDescription, x.ClassifiedDescription, x.ClassifiedTitle, x.RefNo }).Take(0).ToList();
            foreach (var a in categories)
            {
                classifieds = classifieds.Concat(db.Classifieds.Select(x => new { x.ClassifiedID, x.CategoryID, x.Category.CategoryTitle, x.Category.CategoryDescription, x.ClassifiedDescription, x.ClassifiedTitle, x.RefNo }).Where(e=>e.CategoryID==a.ID).OrderByDescending(e => e.ClassifiedID).GroupBy(e => e.CategoryID).SelectMany(g => g.Take(10)).OrderByDescending(e => e.ClassifiedID)).ToList();

            }

            return Json(classifieds, JsonRequestBehavior.AllowGet);
       
        }

        // GET: Api
        public JsonResult GetReferenceNo()
        {
            Reference cReference;
            cReference = db.References.Find(1);
            if(cReference!=null)
            {
                cReference.NextRefNo = "REF" + String.Format("{0:0000000000}", int.Parse(cReference.NextRefNo.Substring(3))+1);
                db.SaveChanges();
            }
            db.Configuration.ProxyCreationEnabled = false;
            return Json(db.References.Where(e => e.Id == 1).Select(x => new { x.NextRefNo }).ToList(), JsonRequestBehavior.AllowGet);

        }

        // GET: Api
        public JsonResult Categories(int? id)
        {
            if (id == null)
            {
                db.Configuration.ProxyCreationEnabled = false;
                return Json(db.Categories.ToList(), JsonRequestBehavior.AllowGet);
            }
            else
            {
                db.Configuration.ProxyCreationEnabled = false;
                return Json(db.Categories.Where(e => e.ID == id && e.IsActive==true).ToList(), JsonRequestBehavior.AllowGet);
            }

        }

        // Post: Api
        [HttpPost]
        public void Index(int? id,string ClassifiedTitle, string ClassifiedDescription,int CategoryID,string ClassifiedImage, bool IsActive, string ContactDetails, string Notes,string RefNo ="")
        {
            Classified cClassified;
            if (id!=null)
            {
                cClassified = db.Classifieds.Find(id);
                cClassified.ClassifiedTitle = ClassifiedTitle;
                cClassified.ClassifiedDescription = ClassifiedDescription;
                cClassified.CategoryID = CategoryID;
                cClassified.ClassfiedImage = ClassifiedImage;
                cClassified.IsActive = IsActive;
                cClassified.ContactDetails = ContactDetails;
                cClassified.Notes = Notes;
                db.SaveChanges();

            }
            else
            {

                cClassified = new Classified();
                cClassified.ClassifiedTitle = ClassifiedTitle;
                cClassified.ClassifiedDescription = ClassifiedDescription;
                cClassified.CategoryID = CategoryID;
                cClassified.ClassfiedImage = ClassifiedImage;
                cClassified.IsActive = IsActive;
                cClassified.RefNo = RefNo;
                cClassified.ContactDetails = ContactDetails;
                cClassified.Notes = Notes;
                db.Classifieds.Add(cClassified);
                db.SaveChanges();
            }
           

           
          //  return Json(db.Classifieds.ToList());

        }


        public static byte[] ToByteArray(string value)
        {
            char[] charArr = value.ToCharArray();
            byte[] bytes = new byte[charArr.Length];
            for (int i = 0; i < charArr.Length; i++)
            {
                byte current = Convert.ToByte(charArr[i]);
                bytes[i] = current;
            }

            return bytes;
        }

        // GET: Api
        public JsonResult users(int? id)
        {
            if (id == null)
            {
                db.Configuration.ProxyCreationEnabled = false;
                return Json(db.Users.OrderByDescending(e=>e.ID).ToList(), JsonRequestBehavior.AllowGet);
            }
            else
            {
                db.Configuration.ProxyCreationEnabled = false;
                return Json(db.Users.Where(e=>e.ID == id).OrderByDescending(e => e.ID ).ToList(), JsonRequestBehavior.AllowGet);
            }

        }

        // Post: Api
        [HttpPost]       
        public void SaveUser(int? id, string UserName, string Password,  string EMail, bool IsActive)
        {
            User cUser;
            if (id != null)
            {
                cUser = db.Users.Find(id);
                cUser.UserName = UserName;
                cUser.Password = Password;
                cUser.EMail = EMail;
                cUser.IsActive = IsActive;               
                db.SaveChanges();

            }
            else
            {
                cUser = new User();               
                cUser.UserName = UserName;
                cUser.Password = Password;
                cUser.EMail = EMail;
                cUser.RoleID = 1;
                cUser.IsActive = IsActive;
                db.Users.Add(cUser);
                db.SaveChanges();
            }

        }


        // POST: Api/Delete/5
        [HttpPost]
        public void DeleteUser(int id)
        {
            User user = db.Users.Find(id);
            db.Users.Remove(user);
            db.SaveChanges();

        }

        // GET: Api/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Classified classified = db.Classifieds.Find(id);
            if (classified == null)
            {
                return HttpNotFound();
            }
            return View(classified);
        }

        // GET: Api/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Api/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ClassifiedID,ClassifiedTitle,ClassifiedDescription")] Classified classified)
        {
            if (ModelState.IsValid)
            {
                db.Classifieds.Add(classified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(classified);
        }

        // GET: Api/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Classified classified = db.Classifieds.Find(id);
            if (classified == null)
            {
                return HttpNotFound();
            }
            return View(classified);
        }

        // POST: Api/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "ClassifiedID,ClassifiedTitle,ClassifiedDescription")] Classified classified)
        {
            if (ModelState.IsValid)
            {
                db.Entry(classified).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(classified);
        }

        // GET: Api/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Classified classified = db.Classifieds.Find(id);
            if (classified == null)
            {
                return HttpNotFound();
            }
            return View(classified);
        }

        // POST: Api/Delete/5
        [HttpPost, ActionName("Delete")]    
        public void DeleteConfirmed(int id)
        {
            Classified classified = db.Classifieds.Find(id);
            db.Classifieds.Remove(classified);
            db.SaveChanges();
           
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
